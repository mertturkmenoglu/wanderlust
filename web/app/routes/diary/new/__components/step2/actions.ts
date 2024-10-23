import { FormType } from "../../hooks";

export function moveItemUp(form: FormType, id: string) {
  const locations = form.getValues("locations");
  const index = locations.findIndex((l) => l.id === id);

  if (index <= 0) {
    return;
  }

  const arr = [...locations];
  const tmp = arr[index - 1];
  arr[index - 1] = arr[index];
  arr[index] = tmp;
  form.setValue("locations", arr);
}

export function moveItemDown(form: FormType, id: string) {
  const locations = form.getValues("locations");
  const index = locations.findIndex((l) => l.id === id);

  if (index >= locations.length - 1 || index === -1) {
    return;
  }

  const arr = [...locations];
  const tmp = arr[index + 1];
  arr[index + 1] = arr[index];
  arr[index] = tmp;
  form.setValue("locations", arr);
}

export function removeItem(form: FormType, id: string) {
  const locations = form.getValues("locations");
  const index = locations.findIndex((l) => l.id === id);

  if (index === -1) {
    return;
  }

  const arr = [...locations];
  arr.splice(index, 1);
  form.setValue("locations", arr);
}
