// import { notes } from "../assets/fakeData"
import { useContext } from "react";
import NoteCard from "../components/NoteCard";
import { NoteContext } from "../context/NoteContext";
import Controls from "../components/Controls";

const NotesPage = () => {
  const { notes } = useContext(NoteContext);

  return (
    <div>
      {notes.map((note) => (
        <NoteCard note={note} key={note.$id} />
      ))}
      <Controls />
    </div>
  );
};

export default NotesPage;
