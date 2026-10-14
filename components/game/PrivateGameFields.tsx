"use client";

import { LockIcon } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MAX_PASSWORD_LENGTH } from "@/lib/game/const";

type Props = {
  isPrivate: boolean;
  onIsPrivateChange: (isPrivate: boolean) => void;
  /** Under the switch: who needs the password. */
  switchDescription: string;
  password: string;
  onPasswordChange: (password: string) => void;
  passwordLabel: string;
  passwordPlaceholder: string;
  /** Under the password field. */
  passwordDescription: React.ReactNode;
  /** An error about the password, shown under it. */
  passwordError?: string;
};

/** The private game switch, and the password field it opens (sent as `password` while open). The switch itself sends nothing: a form that needs `isPrivate` adds it. */
export default function PrivateGameFields({
  isPrivate,
  onIsPrivateChange,
  switchDescription,
  password,
  onPasswordChange,
  passwordLabel,
  passwordPlaceholder,
  passwordDescription,
  passwordError,
}: Props) {
  const isPasswordInvalid = Boolean(passwordError);

  return (
    // No gap: the closed password field would still leave one, so the open one brings its own
    <FieldGroup className="gap-0">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="isPrivate">
            <LockIcon strokeWidth={3} className="size-4" />
            Private game
          </FieldLabel>
          <FieldDescription>{switchDescription}</FieldDescription>
        </FieldContent>
        <Switch
          id="isPrivate"
          checked={isPrivate}
          onCheckedChange={onIsPrivateChange}
        />
      </Field>
      <Collapsible open={isPrivate}>
        <CollapsibleContent>
          <Field data-invalid={isPasswordInvalid} className="pt-4">
            <Input
              name="password"
              aria-label={passwordLabel}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              maxLength={MAX_PASSWORD_LENGTH}
              autoComplete="off"
              placeholder={passwordPlaceholder}
              aria-invalid={isPasswordInvalid}
            />
            <FieldDescription>{passwordDescription}</FieldDescription>
            {isPasswordInvalid && <FieldError>{passwordError}</FieldError>}
          </Field>
        </CollapsibleContent>
      </Collapsible>
    </FieldGroup>
  );
}
