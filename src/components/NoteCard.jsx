import { useContext, useRef } from "react";
import Spinner from "../icons/Spinner";
import { useEffect } from "react";
import { useState } from "react";
import { autoGrow, bodyParser, setNewOffset, setZIndex } from "../utils";
import { db } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";

const NoteCard = ({ note }) => {
  const body = bodyParser(note.body);
  const colors = JSON.parse(note.colors);
  const [position, setPosition] = useState(JSON.parse(note.position));

  let mouseStartPos = { x: 0, y: 0 };

  const cardRef = useRef(null);

  const textAreaRef = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);

  oninput = () => {
    autoGrow(textAreaRef);
  };

  // 编辑文本状态
  const [saving, setSaving] = useState(false);

  const keyUpTimer = useRef(null);

  // 编辑完文本保存
  const handleKeyUp = async () => {
    // 1. Initiate "saving" state
    setSaving(true);

    // 2. If we have a timer id,clear it so we can add another two seconds
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }

    // 3. Set timer to trigger saving after 2 seconds
    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };

  const { setSelectedNote } = useContext(NoteContext);
  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      // 设置当前卡片在顶层
      setZIndex(cardRef.current);
      setSelectedNote(note);
      mouseStartPos = { x: e.clientX, y: e.clientY };

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  // 鼠标移动事件
  const mouseMove = (e) => {
    // 1. Calculate move direction
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    // 2. Update start position for next move.
    mouseStartPos = { x: e.clientX, y: e.clientY };

    // 3. Update card top and left position.
    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

    setPosition(newPosition);
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);

    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
  };

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };

    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      ref={cardRef}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
        onMouseDown={mouseDown}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          style={{ color: colors.colorText }}
          defaultValue={body}
          ref={textAreaRef}
          onFocus={() => {
            setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
          onKeyUp={handleKeyUp}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
