import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import type { LobbyRow } from "@/lib/game/lobby";
import { pluralize } from "@/lib/game/format";

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = {
  rows: LobbyRow[];
  /** The current player's name key, to highlight their row. */
  playerKey: string;
};

function rankBadge(row: LobbyRow): string {
  if (row.bingoRank === null) {
    return "🎲";
  }
  return MEDALS[row.bingoRank - 1] ?? "🏆";
}

/** Every player of the game, with their progress, bingos first. */
export default function Lobby({ rows, playerKey }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
        <CardDescription>
          {pluralize(rows.length, "player")} · updates live
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {rows.map((row) => {
            const isMe = row.nameKey === playerKey;
            return (
              <Item
                key={row.nameKey}
                size="sm"
                variant={isMe ? "muted" : "outline"}
              >
                <ItemMedia className="text-2xl">{rankBadge(row)}</ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    {row.name}
                    {isMe && " (you)"}
                  </ItemTitle>
                  <ItemDescription>
                    {row.tickCount}/{row.cellCount} ticked ·{" "}
                    {pluralize(row.lineCount, "line")}
                  </ItemDescription>
                </ItemContent>
              </Item>
            );
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
