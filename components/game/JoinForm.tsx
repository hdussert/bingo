import Form from "next/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MAX_NAME_LENGTH } from "@/lib/game/const";

type Props = {
  code: string;
};

/** Asks the player's name, which picks their grid. */
export default function JoinForm({ code }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Join the game</CardTitle>
        <CardDescription>
          Your name picks your grid: enter the same name to get it back.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action="/play">
          <input type="hidden" name="g" value={code} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Your name</FieldLabel>
              <Input
                id="name"
                name="name"
                required
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
              />
            </Field>
            <Button type="submit">Get my grid</Button>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}
