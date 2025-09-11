export const LineData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Mood trend",
      data: [3, 4, 5, 2,2,3,4],
      backgroundColor: ["white"],
      borderColor: "rgb(251, 146, 60)",
      tension: 0.4,
    },
  ],
};

export const BarData = {
  labels: [
    "Meditation",
    "Exercise",
    "Journaling",
    "Mindfulness",
    "Activity Foucs",
  ],
  datasets: [
    {
      label: "Votes",
      data: [7, 5, 8, 9, 5],
      backgroundColor: "rgb(251, 146, 60)",
      borderWidth: 1,
    },
  ],
};

export const recentActivities = [
  {
    icon: "fas fa-lightbulb",
    description: "Received new AI suggestion: 'Practice gratitude daily'",
    time: "2 hours ago",
  },
  {
    icon: "fas fa-book-open",
    description: "Completed journal prompt: 'What brings you joy today?'",
    time: "Yesterday",
  },
  {
    icon: "fas fa-comments",
    description: "Replied to a peer in 'Anxiety Support' group.",
    time: "2 days ago",
  },
  {
    icon: "fas fa-users",
    description: "Logged mood as 'Calm' after meditation.",
    time: "3 days ago",
  },
  {
    icon: "fas fa-award",
    description: "Earned 'Mindful Mover' badge!",
    time: "4 days ago",
  },
];
  
export const remainingbadges = [
  {
    type: "STREAK_50",
    title: "Burning Commitment",
    description: "50 days of unwavering dedication to yourself.",
    logo: "/badges/flame_50.png",
  },
  {
    type: "STREAK_100",
    title: "Eternal Ember",
    description: "100 days — your light never fades.",
    logo: "/badges/flame_100.png",
  },
  ,
  {
    type: "SELF_CARE_10",
    title: "Grove",
    description: "Nurtured growth through 10 self-care actions.",
    logo: "/badges/leaf_10.png",
  },
  {
    type: "SELF_CARE_30",
    title: "Blossom",
    description: "A blooming dedication to your well-being.",
    logo: "/badges/flower_30.png",
  },
  {
    type: "SELF_CARE_50",
    title: "Sanctuary",
    description: "You've built a safe space through 50 self-care moments.",
    logo: "/badges/tree_50.png",
  },
  {
    type: "SELF_CARE_75",
    title: "Phoenix",
    description: "Resilience reborn through 75 self-care rituals.",
    logo: "/badges/phoenix_75.png",
  },
  {
    type: "SELF_CARE_100",
    title: "Harmony",
    description: "A perfect symphony of 100 mindful actions.",
    logo: "/badges/lotus_100.png",
  },
  {
    type: "COMMUNITY_ENGAGEMENT_20",
    title: "Trusted Companion",
    description: "Actively engaged in helping 20 peers.",
    logo: "/badges/community_20.png",
  },
  {
    type: "JOURNALING_10",
    title: "Reflector",
    description: "Completed 10 journal entries.",
    logo: "/badges/journal_10.png",
  },
  {
    type: "JOURNALING_50",
    title: "Soul Writer",
    description: "50 journal entries of deep introspection.",
    logo: "/badges/journal_50.png",
  },
];

export const achievedbadges = [
  {
    type: "FIRST_LOGIN",
    title: "Dawn Walker",
    description: "Your journey has begun.",
    logo: "/badges/first_login.png",
  },
  {
    type: "FIRST_CHECKIN",
    title: "Soul Step",
    description: "You’ve taken your first mindful step.",
    logo: "/badges/checkin.png",
  },
  {
    type: "STREAK_10",
    title: "Rising Flame",
    description: "You’ve maintained a 10-day streak.",
    logo: "/badges/flame_10.png",
  },
  {
    type: "SELF_CARE_5",
    title: "Seedling",
    description: "Planted your first five acts of self-kindness.",
    logo: "/badges/leaf_5.png",
  },
  {
    type: "COMMUNITY_ENGAGEMENT_5",
    title: "Kind Voice",
    description: "Supported others 5 times in the community.",
    logo: "/badges/community_5.png",
  },
];

export const moodActivities = {
  sad: [
    {
      title: "Talk to a Friend",
      description:
        "Call or message someone you trust and talk about how you're feeling.",
      icon: "chat",
    },
    {
      title: "Go for a Short Walk",
      description: "A little fresh air and movement can uplift your mood.",
      icon: "directions_walk",
    },
    {
      title: "Listen to Uplifting Music",
      description: "Play your favorite happy or calming playlist.",
      icon: "music_note",
    },
    {
      title: "Write in a Journal",
      description: "Express your feelings freely in a private space.",
      icon: "edit",
    },
  ],
  dissatisfied: [
    {
      title: "Take a 5-Minute Breathing Break",
      description: "Practice mindful breathing to reset your emotions.",
      icon: "self_improvement",
    },
    {
      title: "Declutter Your Space",
      description: "Clean or organize something small to feel in control.",
      icon: "home",
    },
    {
      title: "Drink Water or Tea",
      description: "Hydrate yourself; physical comfort can impact emotions.",
      icon: "local_cafe",
    },
    {
      title: "Watch a Short Comedy Clip",
      description: "Laughter releases endorphins and improves your mood.",
      icon: "theaters",
    },
  ],
  neutral: [
    {
      title: "Stretch for 5 Minutes",
      description: "Gentle stretching helps with body awareness and calmness.",
      icon: "accessibility",
    },
    {
      title: "Check Off a Small Task",
      description: "Finish a low-effort task to build momentum.",
      icon: "check_circle",
    },
    {
      title: "Try a New Song or Podcast",
      description: "Stimulate your curiosity with something new.",
      icon: "headphones",
    },
    {
      title: "Step Outside Briefly",
      description: "Change of scenery can refresh your senses.",
      icon: "wb_sunny",
    },
  ],
  calm: [
    {
      title: "Meditate for 10 Minutes",
      description: "Deepen your sense of calm through focused meditation.",
      icon: "spa",
    },
    {
      title: "Do a Creative Activity",
      description: "Draw, paint, or write something artistic.",
      icon: "palette",
    },
    {
      title: "Cook a Simple Meal",
      description: "Engage your senses through mindful cooking.",
      icon: "restaurant",
    },
    {
      title: "Practice Gratitude",
      description: "List 3 things you’re thankful for today.",
      icon: "favorite",
    },
  ],
  happy: [
    {
      title: "Share Your Joy",
      description: "Tell someone what made your day great!",
      icon: "emoji_emotions",
    },
    {
      title: "Capture the Moment",
      description: "Take a photo or write a post to preserve the good vibe.",
      icon: "photo_camera",
    },
    {
      title: "Do a Random Act of Kindness",
      description: "Make someone else's day a little brighter.",
      icon: "volunteer_activism",
    },
    {
      title: "Dance or Move Freely",
      description: "Express your energy with movement.",
      icon: "celebration",
    },
  ],
};
