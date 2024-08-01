import { useContext, useRef } from "react";
import colors from "../assets/colors.json";
import Plus from "../icons/Plus";
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";

const AddButton = () => {
  const staringPos = useRef(10);

  const { setNotes } = useContext(NoteContext);

  const addNote = async () => {
    const payload = {
      position: JSON.stringify({
        x: staringPos.current,
        y: staringPos.current,
      }),
      colors: JSON.stringify(colors[0]),
    };
    staringPos.current += 10;
    const response = await db.notes.create(payload);
    setNotes((prevState) => [response, ...prevState]);
  };
  return (
    <div id="add-btn" onClick={addNote}>
      <Plus />
    </div>
  );
};

export default AddButton;
