export function GET(request: Request) {
  console.log("GET Requst received");
  const data = [
    {
      id: 1,
      text: "⭐️ Launched my new app, so excited!",
      isLiked: false,
    },
    {
      id: 2,
      text: "🎨 Working on some new designs today. Loving how its shaping up",
      isLiked: true,
    },
    {
      id: 3,
      text: "🏃‍♂️ Feeling geared up for my morning run!",
      isLiked: true,
    },
  ];
  return Response.json(data);
}
export function POST(request: Request) {
  console.log("POST Requst received");

  return Response.json({
    hello: "world",
  });
}
