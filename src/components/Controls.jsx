import AddButton from "./AddButton";
import colors from "../assets/colors";
import Color from "./Color";

const Controls = () => {
  return (
    <div id="controls">
      <AddButton />
      {colors.map((color) => (
        <Color key={color.id} color={color} />
      ))}
    </div>
  );
};

export default Controls;
