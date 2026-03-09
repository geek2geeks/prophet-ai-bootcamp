import streamlit as st
import pandas as pd
from pathlib import Path
from lib.auth import require_auth, is_admin
from lib.course import DAYS
from lib.db import get_progress, set_exercise_complete, set_exercise_incomplete, submit_challenge, get_submissions, get_ai_reviews, save_ai_review
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget, review_day1_exercise_answer


DATASETS_BY_DAY = {
    0: [
        ("carteira_vida_sample.csv", "Carteira Vida sample usada nos exercicios do Dia 0."),
        ("tabua_mortalidade_CSO2017.csv", "Tabua de mortalidade base para prompts precisos e exploradores."),
    ],
    1: [
        ("reporting_vida_q4_2025.csv", "Mock reporting trimestral antes da deterioracao."),
        ("reporting_vida_q1_2026.csv", "Mock reporting trimestral seguinte para run comparison."),
        ("manual_reporting_tasks.csv", "Mapa do trabalho manual que uma equipa atuarial ainda faz."),
    ],
}


def _dataset_path(day_number: int, filename: str) -> Path:
    return Path(f"data/day{day_number}/{filename}")


def render_day_data_panel(day_number: int):
    datasets = DATASETS_BY_DAY.get(day_number, [])
    if not datasets:
        return

    section_title("Dados do dia", "🗂️", "rose")
    render_html("<div class='resource-section-card'><h3>CSV prontos para usar</h3><p>Descarrega os ficheiros usados nos exercicios sem sair da app.</p></div>")

    for filename, description in datasets:
        path = _dataset_path(day_number, filename)
        if not path.exists():
            st.warning(f"Ficheiro em falta: {path}")
            continue

        col_info, col_download = st.columns([4, 1], vertical_alignment="center")
        with col_info:
            render_html(f"""
            <div class="resource-item" style="margin-bottom:12px;">
                <span class="resource-badge" style="background:#FCE7F3; color:#9D174D;">CSV</span>
                <div>
                    <strong style="color:#0F172A; font-size:0.92rem;">{filename}</strong>
                    <p style="margin:2px 0 0; font-size:0.85rem; color:#64748B;">{description}</p>
                </div>
            </div>
            """)
        with col_download:
            st.download_button(
                "Download",
                data=path.read_bytes(),
                file_name=path.name,
                mime="text/csv",
                key=f"download_{day_number}_{filename}",
                use_container_width=True,
            )


def render_day1_lab():
    q4_path = _dataset_path(1, "reporting_vida_q4_2025.csv")
    q1_path = _dataset_path(1, "reporting_vida_q1_2026.csv")
    tasks_path = _dataset_path(1, "manual_reporting_tasks.csv")
    if not (q4_path.exists() and q1_path.exists() and tasks_path.exists()):
        return

    q4 = pd.read_csv(q4_path)
    q1 = pd.read_csv(q1_path)
    tasks = pd.read_csv(tasks_path)

    merged = q4.merge(q1, on=["produto", "segmento"], suffixes=("_q4", "_q1"))
    merged["delta_lucro"] = merged["lucro_tecnico_eur_q1"] - merged["lucro_tecnico_eur_q4"]
    merged["delta_reserva"] = merged["reserva_best_estimate_eur_q1"] - merged["reserva_best_estimate_eur_q4"]
    merged["delta_sinistros"] = merged["sinistros_incorridos_eur_q1"] - merged["sinistros_incorridos_eur_q4"]
    merged["delta_lapses"] = merged["lapses_q1"] - merged["lapses_q4"]
    merged["segmento_label"] = merged["produto"] + " | " + merged["segmento"]

    total_lucro_delta = int(merged["delta_lucro"].sum())
    total_reserva_delta = int(merged["delta_reserva"].sum())
    total_sinistros_delta = int(merged["delta_sinistros"].sum())
    total_manual_hours = int(tasks["tempo_manual_horas"].sum())
    worst_profit_lines = []
    for _, row in merged.nsmallest(3, "delta_lucro").iterrows():
        worst_profit_lines.append(
            f"- {str(row['segmento_label'])}: EUR {int(row['delta_lucro']):,}"
        )

    top_reserve_lines = []
    for _, row in merged.nlargest(3, "delta_reserva").iterrows():
        top_reserve_lines.append(
            f"- {str(row['segmento_label'])}: EUR {int(row['delta_reserva']):,}"
        )

    top_task_lines = []
    for _, row in tasks.nlargest(3, "tempo_manual_horas").iterrows():
        top_task_lines.append(
            f"- {str(row['tarefa'])}: {int(row['tempo_manual_horas'])}h | {str(row['impacto_no_negocio'])}"
        )

    st.session_state["day1_lab_review_context"] = "\n".join([
        f"Delta lucro tecnico total: EUR {total_lucro_delta:,.0f}",
        f"Delta reserva total: EUR {total_reserva_delta:,.0f}",
        f"Delta sinistros total: EUR {total_sinistros_delta:,.0f}",
        f"Horas manuais por ciclo: {total_manual_hours}",
        "Top 3 segmentos por deterioracao do lucro:",
        *worst_profit_lines,
        "Top 3 segmentos por subida de reserva:",
        *top_reserve_lines,
        "Top tarefas manuais por carga operacional:",
        *top_task_lines,
    ])

    section_title("Lab Dia 1", "🧪", "indigo")
    render_html("""
    <div class="saas-card" style="margin-bottom:20px; border:1px solid #C7D2FE; background:linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%);">
        <h3 style="margin:0 0 8px; color:#312E81;">Run comparison com dados reais de mock reporting</h3>
        <p style="margin:0; color:#5C6B7B; line-height:1.6;">Este lab transforma um exercicio passivo num mini workflow de produto. Primeiro exploras a variacao no proprio Streamlit. Depois usas o OpenCode para explicar o que mudou, escrever a nota para o CFO e propor a automacao certa.</p>
    </div>
    """)

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Delta lucro tecnico", f"EUR {total_lucro_delta:,.0f}")
    m2.metric("Delta reserva", f"EUR {total_reserva_delta:,.0f}")
    m3.metric("Delta sinistros", f"EUR {total_sinistros_delta:,.0f}")
    m4.metric("Horas manuais / ciclo", total_manual_hours)

    metric = st.selectbox(
        "Qual variacao queres explorar?",
        ["delta_lucro", "delta_reserva", "delta_sinistros", "delta_lapses"],
        format_func=lambda x: {
            "delta_lucro": "Lucro tecnico",
            "delta_reserva": "Reserva best estimate",
            "delta_sinistros": "Sinistros",
            "delta_lapses": "Lapses",
        }[x],
        key="day1_metric_view",
    )

    chart_df = merged[["segmento_label", metric]].set_index("segmento_label")
    st.bar_chart(chart_df, height=300)

    with st.expander("Ver tabela completa de comparacao", expanded=False):
        st.dataframe(
            merged[[
                "produto", "segmento", "lucro_tecnico_eur_q4", "lucro_tecnico_eur_q1", "delta_lucro",
                "reserva_best_estimate_eur_q4", "reserva_best_estimate_eur_q1", "delta_reserva",
                "sinistros_incorridos_eur_q4", "sinistros_incorridos_eur_q1", "delta_sinistros",
                "lapses_q4", "lapses_q1", "delta_lapses",
            ]],
            use_container_width=True,
            hide_index=True,
        )
        st.dataframe(tasks, use_container_width=True, hide_index=True)

    st.markdown("**Perguntas para responder com AI**")
    q1_col, q2_col = st.columns(2)
    with q1_col:
        selected_driver = st.radio(
            "Qual parece ser o driver principal da subida de reserva?",
            ["Sinistralidade", "Lapses", "Crescimento de premio", "Nao da para saber"],
            key="day1_driver_guess",
        )
        st.text_area(
            "Que 2 segmentos explicam mais a deterioracao do lucro?",
            placeholder="Ex: Temporario 55-64 e Temporario 45-54...",
            key="day1_segments_notes",
            height=100,
        )
    with q2_col:
        st.text_area(
            "Escreve a tua versao curta da nota ao CFO antes de pedir ajuda ao OpenCode",
            placeholder="Em 4-5 linhas, o que dirias?",
            key="day1_cfo_note",
            height=100,
        )
        st.multiselect(
            "Onde esta o trabalho manual repetitivo neste workflow?",
            [
                "Juntar runs de varios periodos",
                "Atribuir deltas a drivers",
                "Escrever memo executivo",
                "Reconciliar lapses observados vs esperados",
                "Preparar pack de auditoria",
            ],
            key="day1_manual_pain",
        )

    st.info(
        "Prompt sugerido para OpenCode: 'Compara reporting_vida_q4_2025.csv e reporting_vida_q1_2026.csv."
        " Identifica os maiores drivers da variacao do lucro tecnico e da reserva."
        " Resume em 5 linhas para o CFO e sugere uma feature AI para automatizar este reporting trimestral.'"
    )


def _ensure_day1_review_state():
    if "day1_review_results" not in st.session_state:
        st.session_state.day1_review_results = {}


def _day1_review_doc_id(item_id: str) -> str:
    return f"day1_{item_id}"


def _load_day1_reviews_into_session(user_id: str):
    _ensure_day1_review_state()
    if st.session_state.get("day1_reviews_loaded_for") == user_id:
        return

    stored_reviews = get_ai_reviews(user_id, day=1)
    loaded = {}
    for item_id in [*DAY1_EXERCISE_IDS, DAY1_CHALLENGE_ID]:
        doc = stored_reviews.get(_day1_review_doc_id(item_id))
        if doc:
            loaded[item_id] = doc
    st.session_state.day1_review_results = loaded
    st.session_state.day1_reviews_loaded_for = user_id


DAY1_EXERCISE_IDS = {"ex1.1", "ex1.2", "ex1.3", "ex1.4", "ex1.5", "ex1.6", "ex1.7"}
DAY1_CHALLENGE_ID = "des1"


def _has_successful_review(item_id: str) -> bool:
    review = st.session_state.get("day1_review_results", {}).get(item_id)
    return bool(review and not review.get("error") and review.get("reviewed_answer"))


def _has_current_review(item_id: str, current_answer: str) -> bool:
    review = st.session_state.get("day1_review_results", {}).get(item_id)
    if not review or review.get("error"):
        return False
    return (review.get("reviewed_answer") or "") == current_answer


def _build_day1_review_answer(exercise_id: str, draft: str) -> str:
    draft = (draft or "").strip()
    if exercise_id != "ex1.7":
        return draft

    parts = []
    if draft:
        parts.append("Draft final do aluno:\n" + draft)

    driver_guess = st.session_state.get("day1_driver_guess")
    segments_notes = (st.session_state.get("day1_segments_notes") or "").strip()
    cfo_note = (st.session_state.get("day1_cfo_note") or "").strip()
    manual_pain = st.session_state.get("day1_manual_pain") or []

    if driver_guess:
        parts.append(f"Resposta no lab -- driver principal da subida de reserva: {driver_guess}")
    if segments_notes:
        parts.append("Resposta no lab -- segmentos que explicam a deterioracao do lucro:\n" + segments_notes)
    if cfo_note:
        parts.append("Resposta no lab -- nota ao CFO:\n" + cfo_note)
    if manual_pain:
        parts.append("Resposta no lab -- trabalho manual repetitivo identificado:\n- " + "\n- ".join(manual_pain))

    return "\n\n".join(parts).strip()


def _get_day1_review_context(exercise_id: str) -> str:
    context_parts = []

    if exercise_id == "ex1.7":
        lab_context = st.session_state.get("day1_lab_review_context", "")
        if lab_context:
            context_parts.append("Factos do lab Streamlit:\n" + lab_context)

    if exercise_id in {"ex1.2", "ex1.5"}:
        context_parts.append(
            "O exercicio pede ligacao explicita a alavanca observada no Dia 0 e a uma decisao de produto com foco."
        )

    if exercise_id == "ex1.4":
        context_parts.append(
            "A resposta deve apontar problemas concretos, recorrentes e vendaveis; respostas demasiado vagas ou demasiado amplas devem ser penalizadas."
        )

    return "\n\n".join(context_parts)


def render_day1_review_box(exercise: dict):
    _ensure_day1_review_state()

    exercise_id = exercise["id"]
    draft_key = f"day1_answer_{exercise_id}"
    review_result = st.session_state.day1_review_results.get(exercise_id)

    render_html("""
    <div class="saas-card" style="margin:14px 0 10px; border:1px solid #DBEAFE; background:linear-gradient(135deg, #F8FBFF 0%, #FFFFFF 100%);">
        <h4 style="margin:0 0 6px; color:#1D4ED8;">Review com AI para a tua resposta</h4>
        <p style="margin:0; color:#5C6B7B; font-size:0.92rem; line-height:1.6;">Cola aqui o teu draft. O tutor faz uma first-pass review com rubrica, destaca lacunas e recomenda melhorias antes de marcares o exercicio como concluido.</p>
    </div>
    """)

    if exercise_id == "ex1.7":
        st.caption(t("day1_review_lab_hint"))

    draft = st.text_area(
        f"Resposta do aluno para {exercise_id}",
        key=draft_key,
        placeholder="Escreve ou cola aqui a tua resposta para este exercicio...",
        height=180 if exercise_id != "ex1.6" else 260,
        label_visibility="collapsed",
    )

    col_review, col_hint = st.columns([1, 2], vertical_alignment="center")
    with col_review:
        review_clicked = st.button(f"🤖 {t('day1_review_button')} — {exercise_id}", key=f"review_btn_{exercise_id}", use_container_width=True)
    with col_hint:
        st.caption(t("day1_review_disclaimer"))

    if review_clicked:
        answer_for_review = _build_day1_review_answer(exercise_id, draft)
        with st.spinner(t("day1_review_loading")):
            result = review_day1_exercise_answer(
                exercise_id=exercise_id,
                exercise_title=exercise["titulo"],
                exercise_description=exercise["descricao"],
                student_answer=answer_for_review,
                extra_context=_get_day1_review_context(exercise_id),
            )
        result["reviewed_answer"] = answer_for_review
        result["item_id"] = exercise_id
        result["day"] = 1
        result["item_type"] = "exercise"
        result["exercise_title"] = exercise["titulo"]
        result["student_answer"] = answer_for_review
        st.session_state.day1_review_results[exercise_id] = result
        save_ai_review(user_id, _day1_review_doc_id(exercise_id), result)
        review_result = result

    if not review_result:
        return

    if review_result.get("error"):
        st.warning(review_result["error"])
        if not review_result.get("short_feedback") and not review_result.get("strengths") and not review_result.get("gaps"):
            return

    current_answer = _build_day1_review_answer(exercise_id, draft)
    if review_result.get("reviewed_answer") and review_result.get("reviewed_answer") != current_answer:
        st.info(t("day1_review_stale"))

    score_col, pass_col, conf_col = st.columns(3)
    score_col.metric(t("day1_review_score"), f"{review_result.get('score_recommended', 0)}/{review_result.get('max_score', 10)}")
    pass_col.metric(t("day1_review_ready"), t("day1_review_yes") if review_result.get("pass_recommended") else t("day1_review_not_yet"))
    conf_col.metric(t("day1_review_confidence"), str(review_result.get("confidence", "medium")).capitalize())

    short_feedback = review_result.get("short_feedback")
    if short_feedback:
        render_html(f"""
        <div style="margin:10px 0 14px; padding:12px 14px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; color:#1E3A8A; line-height:1.6;">
            <strong>Leitura do tutor:</strong> {short_feedback}
        </div>
        """)

    strengths = review_result.get("strengths") or []
    gaps = review_result.get("gaps") or []
    fixes = review_result.get("required_fixes") or []
    evidence = review_result.get("evidence_used") or []

    if strengths:
        st.markdown(f"**{t('day1_review_strengths')}**")
        for item in strengths:
            st.markdown(f"- {item}")
    if gaps:
        st.markdown(f"**{t('day1_review_gaps')}**")
        for item in gaps:
            st.markdown(f"- {item}")
    if fixes:
        st.markdown(f"**{t('day1_review_fixes')}**")
        for item in fixes:
            st.markdown(f"- {item}")
    if evidence:
        st.markdown(f"**{t('day1_review_evidence')}**")
        for item in evidence:
            st.markdown(f"- {item}")


def render_day1_challenge_review_box(challenge: dict, existing_submission: dict):
    _ensure_day1_review_state()

    challenge_id = challenge["id"]
    review_result = st.session_state.day1_review_results.get(challenge_id)
    challenge_key = f"day1_answer_{challenge_id}"
    default_value = st.session_state.get(challenge_key, existing_submission.get("repo_url", ""))

    render_html("""
    <div class="saas-card" style="margin:0 0 16px; border:1px solid #E9D5FF; background:linear-gradient(135deg, #FAF5FF 0%, #FFFFFF 100%);">
        <h4 style="margin:0 0 6px; color:#7C3AED;">AI review da tese de produto</h4>
        <p style="margin:0; color:#5C6B7B; font-size:0.92rem; line-height:1.6;">Antes de submeteres o desafio, cola aqui a tese ou um draft substancial. O tutor valida foco, prova de conceito, go-to-market e riscos.</p>
    </div>
    """)

    challenge_answer = st.text_area(
        "Draft da tese de produto",
        key=challenge_key,
        value=default_value,
        placeholder="Cola aqui a tua tese de produto ou um draft com conteudo suficiente para review...",
        height=260,
        label_visibility="collapsed",
    )
    challenge_answer = challenge_answer or ""

    col_review, col_hint = st.columns([1, 2], vertical_alignment="center")
    with col_review:
        review_clicked = st.button(f"🤖 {t('day1_review_button')} — {challenge_id}", key=f"review_btn_{challenge_id}", use_container_width=True)
    with col_hint:
        st.caption(t("day1_review_disclaimer"))

    if review_clicked:
        with st.spinner(t("day1_review_loading")):
            result = review_day1_exercise_answer(
                exercise_id=challenge_id,
                exercise_title=challenge["titulo"],
                exercise_description=challenge["descricao"],
                student_answer=challenge_answer,
                extra_context="O desafio des1 deve convencer um primeiro cliente potencial, nao um investidor, e usar prova de conceito com dados reais do Dia 0.",
            )
        result["reviewed_answer"] = challenge_answer
        result["item_id"] = challenge_id
        result["day"] = 1
        result["item_type"] = "challenge"
        result["exercise_title"] = challenge["titulo"]
        result["student_answer"] = challenge_answer
        st.session_state.day1_review_results[challenge_id] = result
        save_ai_review(user_id, _day1_review_doc_id(challenge_id), result)
        review_result = result

    if not review_result:
        return

    if review_result.get("error"):
        st.warning(review_result["error"])
        if not review_result.get("short_feedback") and not review_result.get("strengths") and not review_result.get("gaps"):
            return

    if review_result.get("reviewed_answer") and review_result.get("reviewed_answer") != challenge_answer:
        st.info(t("day1_review_stale"))

    score_col, pass_col, conf_col = st.columns(3)
    score_col.metric(t("day1_review_score"), f"{review_result.get('score_recommended', 0)}/{review_result.get('max_score', challenge['pontos'])}")
    pass_col.metric(t("day1_review_ready"), t("day1_review_yes") if review_result.get("pass_recommended") else t("day1_review_not_yet"))
    conf_col.metric(t("day1_review_confidence"), str(review_result.get("confidence", "medium")).capitalize())

    short_feedback = review_result.get("short_feedback")
    if short_feedback:
        st.info(short_feedback)

    for label_key, field in [
        ("day1_review_strengths", "strengths"),
        ("day1_review_gaps", "gaps"),
        ("day1_review_fixes", "required_fixes"),
        ("day1_review_evidence", "evidence_used"),
    ]:
        values = review_result.get(field) or []
        if values:
            st.markdown(f"**{t(label_key)}**")
            for item in values:
                st.markdown(f"- {item}")

require_auth()
inject_css()

page_header(t("exercicios_title"), t("exercicios_sub"), "📝")

user_id = st.session_state.user["id"]
_load_day1_reviews_into_session(user_id)
progress = get_progress(user_id)
submissions = get_submissions(user_id)

# Day selector
render_html('<div style="margin-bottom:24px;"></div>')
day_options = [f"{t('day')} {d['dia']} — {d['titulo']}" for d in DAYS]
target_day = st.session_state.pop("exercicios_target_day", None)
default_idx = target_day if isinstance(target_day, int) and 0 <= target_day < len(day_options) else 0
selected = st.selectbox(t("select_day"), day_options, index=default_idx, label_visibility="collapsed")
day_idx = day_options.index(selected)
day = DAYS[day_idx]

# Day header card
n_total = len(day["exercicios"]) + 1
n_done = sum(1 for ex in day["exercicios"] if ex["id"] in progress)
n_done += 1 if day["desafio"]["id"] in submissions or day["desafio"]["id"] in progress else 0

render_html(f"""
<div class="exercise-hero">
    <div class="hero-copy">
        <div class="hero-kicker">{t('exercise_sprint')}</div>
        <h2 class="hero-title">{t('day')} {day['dia']} — {day['titulo']}</h2>
        <p>{day['objetivo']}</p>
    </div>
    <div class="meta-grid">
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{n_done}/{n_total}</span>
            <span class="exercise-meta-label">{t('tasks_done')}</span>
        </div>
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{sum(ex['pontos'] for ex in day['exercicios'])}</span>
            <span class="exercise-meta-label">{t('exercise_checklist')}</span>
        </div>
        <div class="exercise-meta-card">
            <span class="exercise-meta-value">{day['desafio']['pontos']}</span>
            <span class="exercise-meta-label">{t('day_challenge')}</span>
        </div>
    </div>
</div>
""")

# --- Bootcamp Keys (Day 0 only) ---
if day["dia"] == 0:
    with st.expander("🔑 " + t("bootcamp_keys_title"), expanded=False):
        render_html(f"""
        <div style="padding:8px 0;">
            <p style="color:#64748B; font-size:0.9rem; line-height:1.6; margin-bottom:16px;">{t('bootcamp_keys_desc')}</p>
        </div>
        """)

        render_html("""
        <div style="padding:8px 16px; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; margin-bottom:16px;">
            <p style="margin:0; color:#1E40AF; font-size:0.85rem; line-height:1.6;">
                <strong>Qual e a diferenca?</strong> A <strong>DeepSeek API Key</strong> e a chave que permite ao OpenCode comunicar com o modelo de IA (e a chave principal que precisas para os exercicios). A <strong>OpenCode Key</strong> e a chave do plano do bootcamp para o proprio OpenCode. Configura primeiro a DeepSeek, depois a OpenCode.
            </p>
        </div>
        """)

        col1, col2 = st.columns(2)
        with col1:
            st.markdown("**🤖 DeepSeek API Key** _(principal)_")
            st.caption(t("bootcamp_keys_deepseek_hint"))
            try:
                dk = st.secrets["bootcamp"]["deepseek_api_key"]
                st.code(dk, language=None)
                st.markdown(f"**{t('bootcamp_keys_config_cmd')}**")
                st.code(f"set DEEPSEEK_API_KEY={dk}", language="bash")
                st.caption("☝️ Windows (CMD)")
                st.code(f"export DEEPSEEK_API_KEY={dk}", language="bash")
                st.caption("☝️ Mac / Linux")
            except Exception:
                st.warning(t("bootcamp_keys_not_configured"))

        with col2:
            st.markdown("**⚡ OpenCode Key**")
            st.caption(t("bootcamp_keys_opencode_hint"))
            try:
                ok = st.secrets["bootcamp"]["opencode_api_key"]
                st.code(ok, language=None)
                st.code(f"set OPENCODE_API_KEY={ok}", language="bash")
                st.caption("☝️ Windows (CMD)")
                st.code(f"export OPENCODE_API_KEY={ok}", language="bash")
                st.caption("☝️ Mac / Linux")
            except Exception:
                st.warning(t("bootcamp_keys_not_configured"))

        render_html("""
        <div style="margin-top:12px; padding:12px; background:#FEF3C7; border:1px solid #FDE68A; border-radius:8px;">
            <p style="margin:0; color:#92400E; font-size:0.85rem;">
                ⚠️ <strong>Seguranca:</strong> Estas chaves sao exclusivas do bootcamp. Nao as partilhes fora do curso nem as coloques em codigo publico.
            </p>
        </div>
        """)

# --- Exercises ---
render_day_data_panel(day["dia"])

if day["dia"] == 1:
    render_day1_lab()

section_title(t("exercise_checklist"), "✅", "emerald")

for ex in day["exercicios"]:
    is_done = ex["id"] in progress
    review_answer = _build_day1_review_answer(ex["id"], st.session_state.get(f"day1_answer_{ex['id']}", "") or "") if day["dia"] == 1 else ""
    has_review = _has_successful_review(ex["id"]) if day["dia"] == 1 else True
    has_current_review = _has_current_review(ex["id"], review_answer) if day["dia"] == 1 else True
    day1_block_reason = None
    if day["dia"] == 1:
        if not has_review:
            day1_block_reason = t("day1_review_gate_required")
        elif review_answer and not has_current_review:
            day1_block_reason = t("day1_review_gate_refresh")

    with st.container():
        new_state = is_done
        render_html(f"""
        <div class="exercise-item-card {'done' if is_done else ''}">
            <div class="exercise-item-top">
                <h4 class="exercise-title">{ex['titulo']}</h4>
                <span class="badge-pill {'emerald' if is_done else 'slate'}">{'✓ ' if is_done else ''}{ex['pontos']} pts</span>
            </div>
            <p class="exercise-desc">{ex['descricao']}</p>
        </div>
        """)
        col_check, col_status = st.columns([4, 1], vertical_alignment="center")
        with col_check:
            if day1_block_reason and not is_done:
                st.checkbox(t("mark_complete"), value=False, key=f"cb_disabled_{ex['id']}", disabled=True)
            else:
                new_state = st.checkbox(t("mark_complete"), value=is_done, key=f"cb_{ex['id']}")
        with col_status:
            if is_done:
                render_html(f'<div class="exercise-status-chip">✓ {t("exercise_status_completed")}</div>')
            else:
                render_html(f'<div class="exercise-status-chip">○ {t("exercise_status_open")}</div>')

        if day1_block_reason and not is_done:
            st.caption(day1_block_reason)
            new_state = False

        if new_state != is_done:
            if new_state:
                set_exercise_complete(user_id, ex["id"], ex["pontos"])
            else:
                set_exercise_incomplete(user_id, ex["id"])
            st.rerun()

        if day["dia"] == 1:
            render_day1_review_box(ex)

# --- Challenge ---
section_title(t("day_challenge"), "🏆", "indigo")
d = day["desafio"]

render_html(f"""
<div class="saas-card" style="border: 1px solid #FFD0C2; background: linear-gradient(135deg, #FFF0EA 0%, #FFFFFF 100%); margin-bottom: 24px;">
    <div class="exercise-challenge-top">
        <span class="badge-pill indigo" style="background:#4F46E5; color:white; border:none;">{d["pontos"]} pts</span>
        <h3 style="margin:0; color:#12263F; font-size:1.15rem;">{d["titulo"]}</h3>
    </div>
    <p style="margin:0; color:#5C6B7B; font-size:0.95rem; line-height:1.6;">{d["descricao"]}</p>
</div>
""")

existing_sub = submissions.get(d["id"], {})

with st.container():
    render_html('<div class="challenge-form-shell">')
    st.markdown(f"#### {t('submit_project')}")
    render_html(f"<p style='font-size:0.9rem; color:#64748B;'>{t('submit_description')}</p>")
    if day["dia"] == 0:
        render_html("""
        <p class='challenge-note' style='color:#059669; font-size:0.9rem;'>
            📎 Dia 0: Cola um link (Google Drive, pasta partilhada) OU descreve o que fizeste. Nao precisas de GitHub.
        </p>
        """)
    else:
        render_html(f"<p class='challenge-note'>{t('exercise_repo_hint')}</p>")

    if day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID:
        render_day1_challenge_review_box(d, existing_sub)

    with st.form(f"challenge_{d['id']}", border=False):
        repo_url = st.text_input(
            t("repo_label"),
            value=existing_sub.get("repo_url", ""),
            placeholder="Link Google Drive, pasta partilhada, ou descricao do que fizeste..." if day["dia"] == 0 else t("repo_placeholder"),
            label_visibility="collapsed"
        )
        challenge_review_answer = st.session_state.get(f"day1_answer_{d['id']}", "") or ""
        challenge_has_review = _has_successful_review(d["id"]) if day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID else True
        challenge_has_current_review = _has_current_review(d["id"], challenge_review_answer) if day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID else True

        if is_admin():
            st.markdown("---")
            st.markdown(f"👑 **{t('admin_panel')}**")
            pontos = st.slider(t("assign_score"), 0, d["pontos"], existing_sub.get("pontos", 0))
        else:
            pontos = d["pontos"]
            if existing_sub:
                render_html(f"""
                <div style="margin-top:12px; padding:12px; background:#ECFDF5; border:1px solid #A7F3D0; border-radius:8px; display:flex; align-items:center; gap:12px;">
                    <span style="font-size:1.2rem;">✅</span>
                    <div>
                        <strong style="color:#065F46; font-size:0.9rem;">{t('project_submitted')}</strong><br/>
                        <span style="color:#047857; font-size:0.85rem;">{t('graded_msg', pts=existing_sub.get('pontos', 0), max=d['pontos'])}</span>
                    </div>
                </div>
                """)

        render_html('<div style="margin-top:16px;"></div>')
        if day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID and not challenge_has_review:
            st.caption(t("day1_review_gate_required_challenge"))
        elif day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID and challenge_review_answer and not challenge_has_current_review:
            st.caption(t("day1_review_gate_refresh_challenge"))
        submitted = st.form_submit_button(t("submit_btn"), width="stretch", type="primary")
        if submitted and repo_url:
            if day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID and not challenge_has_review:
                st.warning(t("day1_review_gate_required_challenge"))
            elif day["dia"] == 1 and d["id"] == DAY1_CHALLENGE_ID and challenge_review_answer and not challenge_has_current_review:
                st.warning(t("day1_review_gate_refresh_challenge"))
            else:
                submit_challenge(user_id, d["id"], repo_url, pontos)
                st.success(t("submitted_success"))
                st.rerun()
    render_html('</div>')

st.markdown("---")
render_tutor_widget()
