// Inspiration: https://www.behance.net/gallery/205624007/Telegiv-Commercial-Mobile-App-UXUI-design
// the leaderboard part.
import { Image, View } from "react-native";
import Animated, {
  FadeInRight,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const users = [
  { name: "Alice", score: 12 },
  { name: "Bob", score: 22 },
  { name: "Charlie", score: 4 },
  { name: "Catalin", score: 15 },
  { name: "Adam", score: 33 },
  { name: "David", score: 10 },
  { name: "Eve", score: 31 },
];

// Constants
const _avatarSize = 28;
const _spacing = 4;
const _staggerDuration = 50;
const _initialDelayDuration = 1500;
// The height of the container where the bars are going to be rendered.
const _containerSize = 150;

// Re-maps a number from one range to another.
// https://processing.org/reference/map_.html
function mapRange(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

type PlaceProps = {
  user: (typeof users)[0];
  index: number;
  onFinish?: () => void;
  minMax: number[];
  anim: SharedValue<number>;
};

function Place({ user, onFinish, index, minMax, anim }: PlaceProps) {
  const _height = mapRange(
    user.score,
    minMax[0],
    minMax[1],
    _spacing * 4,
    _containerSize - _avatarSize
  );

  const _anim = useDerivedValue(() => {
    return withDelay(
      _staggerDuration * index,
      withSpring(anim.value, { damping: 80, stiffness: 200 })
    );
  });

  const stylez = useAnimatedStyle(() => {
    return {
      height: _anim.value * _height + _avatarSize + _spacing,
      borderBottomLeftRadius: interpolate(
        _anim.value,
        [0, 1],
        [_avatarSize / 2, 0]
      ),
      borderBottomRightRadius: interpolate(
        _anim.value,
        [0, 1],
        [_avatarSize / 2, 0]
      ),
      backgroundColor:
        minMax[1] === user.score
          ? // Example on how to highlight any user, in this case the one with the highest score.
            // The background will be animated from a light gray to gold.
            interpolateColor(_anim.value, [0, 1], ["rgba(0,0,0,0.05)", "gold"])
          : "rgba(0,0,0,0.05)",
    };
  });

  // Only used for the text to be displayed after the animation has started.
  // We're going to run the animation after 20% of the total duration.
  const textStylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(_anim.value, [0, 0.2, 1], [0, 0, 1]),
    };
  });

  return (
    <Animated.View
      entering={FadeInRight.delay(
        _staggerDuration * index + _initialDelayDuration
      )
        .springify()
        .damping(80)
        .stiffness(200)
        .withCallback((finished) => {
          if (finished && onFinish) {
            // Reminder, we're running Layout animations on the UI thread so we need to use runOnJS.
            runOnJS(onFinish)();
          }
        })}
      style={{ alignItems: "center" }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: _spacing / 2,
            borderRadius: _avatarSize / 2 + _spacing,
            gap: _spacing / 2,
            alignItems: "center",
          },
          stylez,
        ]}
      >
        <View
          style={{
            width: _avatarSize,
            aspectRatio: 1,
            borderRadius: _avatarSize / 2,
            borderWidth: 1,
            borderColor: "gray",
            borderStyle: "dashed",
            padding: _spacing / 4,
          }}
        >
          <Image
            source={{ uri: `https://i.pravatar.cc/150?u=user_${index + 1}` }}
            style={{ flex: 1, borderRadius: _avatarSize }}
          />
        </View>
        <Animated.Text
          style={[
            {
              fontSize: _avatarSize / 3,
              fontWeight: "700",
              fontFamily: "Inter",
            },
            textStylez,
          ]}
        >
          {user.score}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function LeaderBoard() {
  // Find the min and max score of the users
  const minMaxScoreOfUsers = users.reduce(
    (acc, user) => {
      if (user.score < acc[0]) {
        acc[0] = user.score;
      }
      if (user.score > acc[1]) {
        acc[1] = user.score;
      }
      return acc;
    },
    [Infinity, -Infinity]
  );
  //   console.log({
  //     minMaxScoreOfUsers,
  //     users,
  //   });

  const _anim = useSharedValue(0);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: _spacing,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          height: _containerSize,
        }}
      >
        {users.map((user, index) => (
          <Place
            key={index}
            user={user}
            index={index}
            minMax={minMaxScoreOfUsers}
            anim={_anim}
            onFinish={
              // When last has finished, we'd like to kick the animation
              // on the bars.
              index === users.length - 1
                ? () => {
                    _anim.value = 1;
                    console.log("Finished", index);
                  }
                : undefined
            }
          />
        ))}
      </View>
    </View>
  );
}
