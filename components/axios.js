import axios from "axios";

async function TableAxiso() {
  const table = await axios.get("/api/students").then((res) => res);
  return table;
}

export default TableAxiso;
