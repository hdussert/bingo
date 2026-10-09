import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** A numbered section of a form. */
export default function FormStep({
  step,
  title,
  description,
  children,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {step}
          </span>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
