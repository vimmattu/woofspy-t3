import { BaseProps } from "./types";

const SetSensitivity: React.FC<BaseProps> = ({ proceedSetup }) => {
  return (
    <div>
      <p>Set sensitivity</p>
      <button onClick={proceedSetup}>Next</button>
    </div>
  );
};

export default SetSensitivity;
