// Temporary in-memory store for development
interface TempStore {
  courses: any[];
  services: any[];
  theme: string | null;
}

const store: TempStore = {
  courses: [],
  services: [],
  theme: null
};

export function getTempStore() {
  return store;
}

export async function addCourse(course: any) {
  const id = `temp-${Date.now()}`;
  const newCourse = { ...course, id };
  store.courses.push(newCourse);
  return { id, ...course };
}

export async function addService(service: any) {
  const id = `temp-${Date.now()}`;
  const newService = { ...service, id };
  store.services.push(newService);
  return { id, ...service };
}

export async function getCourses() {
  return store.courses;
}

export async function getServices() {
  return store.services;
}

export async function setTheme(theme: string) {
  store.theme = theme;
  return { theme };
}

export async function getTheme() {
  return { theme: store.theme };
}