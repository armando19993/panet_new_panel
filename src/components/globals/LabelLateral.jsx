import { Label } from "../ui/label";

const LabelLateral = ({ 
  title, 
  description, 
  flexDirection = 'row', 
  justifyContent = 'between' 
}) => {
  return (
    <div className={`flex flex-${flexDirection} justify-${justifyContent}`}>
      <div className="font-bold">{title}</div>
      <div>{description}</div>
    </div>
  );
};

export default LabelLateral;
