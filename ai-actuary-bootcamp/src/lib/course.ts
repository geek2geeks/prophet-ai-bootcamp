import courseData from "@/data/course.json";

export type Exercise = {
  id: string;
  titulo: string;
  pontos: number;
  descricao: string;
};

export type Challenge = {
  id: string;
  titulo: string;
  pontos: number;
  descricao: string;
};

export type Topic = {
  titulo: string;
  conteudo: string;
};

export type ModuleContent = {
  titulo: string;
  topicos: Topic[];
};

export type Day = {
  dia: number;
  titulo: string;
  semana: number;
  objetivo: string;
  modulos: string[];
  exercicios: Exercise[];
  desafio: Challenge;
  conteudo: Record<string, ModuleContent>;
};

type CoursePayload = {
  title: string;
  subtitle: string;
  totalPoints: number;
  badges: Array<[number, string]>;
  days: Day[];
};

export type DayWithMeta = Day & {
  slug: string;
  totalExercisePoints: number;
  totalMissionPoints: number;
  topicCount: number;
};

const payload = courseData as unknown as CoursePayload;

export const course = payload;

export function daySlug(dayNumber: number): string {
  return dayNumber.toString().padStart(2, "0");
}

export const days: DayWithMeta[] = payload.days.map((day) => {
  const topicCount = Object.values(day.conteudo).reduce(
    (sum, module) => sum + module.topicos.length,
    0,
  );
  const totalExercisePoints = day.exercicios.reduce(
    (sum, exercise) => sum + exercise.pontos,
    0,
  );

  return {
    ...day,
    slug: daySlug(day.dia),
    totalExercisePoints,
    totalMissionPoints: totalExercisePoints + day.desafio.pontos,
    topicCount,
  };
});

export function getDayBySlug(slug: string): DayWithMeta | undefined {
  return days.find((day) => day.slug === slug);
}

export const missionItems = days.flatMap((day) => [
  ...day.exercicios.map((exercise) => ({
    id: exercise.id,
    points: exercise.pontos,
    day: day.dia,
    slug: day.slug,
  })),
  {
    id: day.desafio.id,
    points: day.desafio.pontos,
    day: day.dia,
    slug: day.slug,
  },
]);
