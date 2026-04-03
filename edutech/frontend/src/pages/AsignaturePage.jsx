import SearchBar from "../components/SearchBar";

export default function Asignatura({ asignatura }) {
return (
    <BrowserRouter>
    <SearchBar />
    <h1>{asignatura}</h1>
    </BrowserRouter>
  );
}