export const handleShowTableAndForm = (form_element, table_element) => {
  const form = document.querySelector(form_element);
  const table = document.querySelector(table_element);

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    table.classList.add("hidden");
    return  "form_display" 
  } else {
    table.classList.remove("hidden");
    form.classList.add("hidden");

    return "table_display" 
  }
};
