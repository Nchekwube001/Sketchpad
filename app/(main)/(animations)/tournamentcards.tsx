import { tournamentData } from "@/mock/tournamentData";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Layout Constants
const SCREEN_WIDTH = Dimensions.get("window").width;
const MATCH_BOX_WIDTH = SCREEN_WIDTH / 2.6;
const MATCH_BOX_HEIGHT = 110;
const MATCH_BOX_HALF_HEIGHT = MATCH_BOX_HEIGHT / 2;
const TENTACLE_WIDTH = 30;
const LINE_RADIUS = 8;

const SNAP_TO_INTERVAL = MATCH_BOX_WIDTH + TENTACLE_WIDTH * 2 + 5;
const SCROLL_RANGE = [3, 2, 1, 0, -1, -2, -3];

interface MatchData {
  player1: string;
  player2: string;
  winner?: string;
}

interface MatchInfo {
  key: string;
  matchData: MatchData;
  isFirstRound: boolean;
  isFirstMatch: boolean;
  isLastMatch: boolean;
  isLastRound: boolean;
}

interface RoundInfo {
  key: number;
  roundMatches: MatchInfo[];
}

interface BracketProps {
  match: MatchInfo;
  roundIndex: number;
  scrollX: SharedValue<number>;
  matchIndex: number;
}

interface RoundsProps {
  round: RoundInfo;
  roundIndex: number;
  scrollX: SharedValue<number>;
}

const LeftTentacle = ({
  roundIndex,
  isFirstRound,
}: {
  roundIndex: number;
  isFirstRound: boolean;
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        left: roundIndex % 2 === 0 ? -1.2 : -1,
        backgroundColor: theme.colors.background,
        opacity: isFirstRound ? 0 : 1,
      }}
    >
      <View
        style={[styles.leftTopTentacle, { borderColor: theme.colors.primary }]}
      />
      <View
        style={[
          styles.leftBottomTentacle,
          { borderColor: theme.colors.primary },
        ]}
      />
    </View>
  );
};

const RightTentacle = ({
  matchIndex,
  isFirstMatch,
  isLastMatch,
}: {
  matchIndex: number;
  isFirstMatch: boolean;
  isLastMatch: boolean;
}) => {
  const theme = useTheme();
  return (
    <View style={{ height: "100%" }}>
      <View
        style={[
          styles.rightTopTentacle,
          {
            borderColor:
              isFirstMatch || matchIndex % 2 === 0
                ? "transparent"
                : theme.colors.primary,
            bottom: matchIndex % 2 === 0 ? 1 : -1,
          },
        ]}
      />
      <View
        style={[
          styles.rightBottomTentacle,
          {
            borderColor:
              isLastMatch || matchIndex % 2 !== 0
                ? "transparent"
                : theme.colors.primary,
          },
        ]}
      />
    </View>
  );
};

const MatchBox = ({ match }: { match: MatchInfo }) => {
  const theme = useTheme();
  const winner = match.matchData.winner;
  const isLastRound = match.isLastRound;

  return (
    <View style={styles.matchBoxContainer}>
      <View
        style={[
          styles.matchBox,
          {
            backgroundColor: theme.colors.card,
            // boxShadow: `0px 0px 1px 0px ${theme.colors.border}`,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.playerContainer,
            {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.playerText, { color: theme.colors.text }]}>
            {match.matchData.player1}
          </Text>
          {match.matchData.player1 === winner && (
            <Text style={{ color: theme.colors.primary }}>
              {isLastRound ? "🏆" : "⚽️"}
            </Text>
          )}
        </View>
        <View style={styles.playerContainer}>
          <Text style={[styles.playerText, { color: theme.colors.text }]}>
            {match.matchData.player2}
          </Text>
          {match.matchData.player2 === winner && (
            <Text style={{ color: theme.colors.primary }}>
              {isLastRound ? "🏆" : "⚽️"}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const Brackets = ({ match, roundIndex, scrollX, matchIndex }: BracketProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const marginVertical = customMargin(roundIndex, scrollX);
    return {
      marginVertical: marginVertical,
      //   marginVertical: 0,
    };
  });

  return (
    <View style={styles.bracketContainer}>
      <LeftTentacle roundIndex={roundIndex} isFirstRound={match.isFirstRound} />
      <Animated.View style={animatedStyle}>
        <MatchBox match={match} />
      </Animated.View>
      <RightTentacle
        matchIndex={matchIndex}
        isFirstMatch={match.isFirstMatch}
        isLastMatch={match.isLastMatch}
      />
    </View>
  );
};

const Rounds = ({ round, roundIndex, scrollX }: RoundsProps) => {
  return (
    <View>
      {round.roundMatches.map((match, matchIndex) => (
        <Brackets
          key={match.key}
          match={match}
          matchIndex={matchIndex}
          roundIndex={roundIndex}
          scrollX={scrollX}
        />
      ))}
    </View>
  );
};

const Main = () => {
  const scrollX = useSharedValue(0);
  const rounds = tournamentData.rounds;
  const roundData = formattedTournamentData(rounds);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      scrollX.value = contentOffset.x;
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      contentInsetAdjustmentBehavior="automatic"
      snapToInterval={SNAP_TO_INTERVAL}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      snapToAlignment="start"
      decelerationRate="fast"
      directionalLockEnabled={true}
      contentContainerStyle={styles.contentContainer}
    >
      {roundData.map((round, index) => (
        <Rounds
          key={round.key}
          round={round}
          roundIndex={index}
          scrollX={scrollX}
        />
      ))}
    </Animated.ScrollView>
  );
};

const formattedTournamentData = (rounds: any[]): RoundInfo[] => {
  return rounds.map((round, roundIndex) => {
    const matches = round.matches;
    const roundMatches = matches.map((matchData: any, matchIndex: number) => {
      return {
        key: `${roundIndex}-${matchIndex}`,
        matchData,
        isFirstRound: roundIndex === 0,
        isFirstMatch: matchIndex === 0,
        isLastMatch: matches.length - 1 === matchIndex,
        isLastRound: roundIndex === rounds.length - 1,
      };
    });

    return {
      key: roundIndex,
      roundMatches,
    };
  });
};

const customMargin = (rootIndex: number, scrollX: SharedValue<number>) => {
  "worklet";
  const inputRange = SCROLL_RANGE.map((distance) => {
    return SNAP_TO_INTERVAL * (rootIndex - distance);
  });
  const outputRange = SCROLL_RANGE.map((distance) => {
    return Math.pow(2, distance - 1) * MATCH_BOX_HEIGHT - MATCH_BOX_HALF_HEIGHT;
  });
  return interpolate(
    scrollX.value,
    inputRange,
    outputRange,
    Extrapolation.CLAMP
  );
};

const styles = StyleSheet.create({
  matchBoxContainer: {
    width: MATCH_BOX_WIDTH,
    height: MATCH_BOX_HEIGHT,
    justifyContent: "center",
  },
  playerText: {
    fontSize: 14,
  },
  matchBox: {
    borderRadius: LINE_RADIUS,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  playerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    height: 1750,
    paddingTop: 10,
    // backgroundColor: "#000",
  },
  bracketContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftTopTentacle: {
    width: TENTACLE_WIDTH,
    height: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: LINE_RADIUS,
  },
  leftBottomTentacle: {
    width: TENTACLE_WIDTH,
    height: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: LINE_RADIUS,
  },
  rightTopTentacle: {
    flex: 1,
    width: TENTACLE_WIDTH,
    borderWidth: 1,
    alignSelf: "baseline",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: LINE_RADIUS,
  },
  rightBottomTentacle: {
    flex: 1,
    width: TENTACLE_WIDTH,
    borderWidth: 1,
    alignSelf: "baseline",
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopEndRadius: LINE_RADIUS,
  },
});

export default Main;
