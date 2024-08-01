import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";

const Color = ({ color }) => {
  const { notes, setNotes, selectedNote } = useContext(NoteContext);
  const changeColor = () => {
    console.log("Selected color:", selectedNote);

    try {
      const currentNoteIndex = notes.findIndex(
        (note) => note.$id === selectedNote.$id
      );

      const thisColor = JSON.stringify(color);

      const updatedNote = {
        ...notes[currentNoteIndex],
        colors: thisColor,
      };

      const newNotes = [...notes];
      newNotes[currentNoteIndex] = updatedNote;
      setNotes(newNotes);

      db.notes.update(selectedNote.$id, {
        colors: thisColor,
      });
    } catch (error) {
      alert("You must select a note before changing colors");
    }
  };

  return (
    <div
      onClick={changeColor}
      className="color"
      style={{ backgroundColor: color.colorHeader }}
    ></div>
  );
};

export default Color;
