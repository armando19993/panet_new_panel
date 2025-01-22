import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import LabelLateral from "./LabelLateral";

const CardComponent = ({
  title,
  description = null,
  content,
  contentFooter = null,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center">{content}</div>
      </CardContent>
      {contentFooter && (
        <CardFooter className="flex justify-between">
          {contentFooter}
        </CardFooter>
      )}
    </Card>
  );
};

export default CardComponent;
