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

const MEDALS = ["🥇", "🥈", "🥉"];

type Props = {
  rows: LobbyRow[];
  playerName: string;
  cellCount: number;
};

function rankBadge(row: LobbyRow): string {
  if (row.bingoRank === null) {
    return "🎲";
  }
  return MEDALS[row.bingoRank - 1] ?? "🏆";
}

/** Every player of the game, with their progress, bingos first. */
export default function Lobby({ rows, playerName, cellCount }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>
        <CardDescription>
          {rows.length} {rows.length === 1 ? "player" : "players"} · updates
          live
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2">
          {rows.map((row) => {
            const isMe = row.name === playerName;
            return (
              <Item
                key={row.name}
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
                    {row.tickCount}/{cellCount} ticked ·{" "}
                    {row.lineCount === 1 ? "1 line" : `${row.lineCount} lines`}
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
