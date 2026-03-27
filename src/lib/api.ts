import data from "./data.json";

export type AutoCompleteItem = {
  value: string;
  label: string;
};

export async function getList(filter: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const lowerFilter = filter.toLocaleLowerCase();
  return data
    .filter(({ name }) => name.toLocaleLowerCase().startsWith(lowerFilter))
    .slice(0, 20)
    .map(({ name, id }) => ({
      value: id,
      label: `${name}`,
    }));
}

export async function addItem(name: string) {
  const response = await fetch("/api/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to add autocomplete item.");
  }

  const createdItem = (await response.json()) as AutoCompleteItem;

  if (!data.some((item) => item.id === createdItem.value)) {
    data.push({
      id: createdItem.value,
      name: createdItem.label,
    });
  }

  return createdItem;
}

export async function getDetail(id: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  await new Promise((resolve) => setTimeout(resolve, 400));
  return await response.json();
}
