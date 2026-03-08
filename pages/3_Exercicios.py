import streamlit as st
import pandas as pd
from pathlib import Path
from lib.auth import require_auth, is_admin
from lib.course import DAYS
from lib.db import get_progress, set_exercise_complete, set_exercise_incomplete, submit_challenge, get_submissions
from lib.theme import inject_css, page_header, section_title, render_html
from lib.i18n import t
from lib.ai import render_tutor_widget


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

require_auth()
inject_css()

page_header(t("exercicios_title"), t("exercicios_sub"), "📝")

user_id = st.session_state.user["id"]
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

    with st.container():
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
            new_state = st.checkbox(t("mark_complete"), value=is_done, key=f"cb_{ex['id']}")
        with col_status:
            if is_done:
                render_html(f'<div class="exercise-status-chip">✓ {t("exercise_status_completed")}</div>')
            else:
                render_html(f'<div class="exercise-status-chip">○ {t("exercise_status_open")}</div>')

        if new_state != is_done:
            if new_state:
                set_exercise_complete(user_id, ex["id"], ex["pontos"])
            else:
                set_exercise_incomplete(user_id, ex["id"])
            st.rerun()

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
    with st.form(f"challenge_{d['id']}", border=False):
        repo_url = st.text_input(
            t("repo_label"),
            value=existing_sub.get("repo_url", ""),
            placeholder="Link Google Drive, pasta partilhada, ou descricao do que fizeste..." if day["dia"] == 0 else t("repo_placeholder"),
            label_visibility="collapsed"
        )

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
        submitted = st.form_submit_button(t("submit_btn"), width="stretch", type="primary")
        if submitted and repo_url:
            submit_challenge(user_id, d["id"], repo_url, pontos)
            st.success(t("submitted_success"))
            st.rerun()
    render_html('</div>')

st.markdown("---")
render_tutor_widget()
