export type ScriptStyle = 'documentary' | 'commercial' | 'tutorial' | 'social-media' | 'cinematic';
export type ScriptTone = 'professional' | 'casual' | 'energetic' | 'dramatic' | 'humorous';

export interface ScriptOptions {
  style: ScriptStyle;
  tone: ScriptTone;
  audience: string;
  description: string;
  duration: number; // in seconds
  fileName: string;
}

export interface ScriptSection {
  id: string;
  label: string;
  timestamp: string;
  content: string;
}

export interface GeneratedScript {
  title: string;
  sections: ScriptSection[];
  totalWords: number;
  estimatedDuration: string;
  notes: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const documentaryHooks: Record<ScriptTone, string[]> = {
  professional: [
    "In a world constantly reshaped by innovation, understanding the forces at play has never been more critical.",
    "Behind every breakthrough lies a story of persistence, vision, and the courage to challenge the status quo.",
    "What you're about to discover will change the way you think about this subject forever.",
  ],
  casual: [
    "Ever wonder what really goes on behind the scenes? Well, you're about to find out.",
    "So here's the thing — this story is way more interesting than most people realize.",
    "Let me take you on a journey that'll make you see things in a completely different light.",
  ],
  energetic: [
    "Hold onto your seats, because what we're about to uncover is absolutely incredible!",
    "This is the kind of story that gets your heart racing and your mind spinning!",
    "Get ready — because what you're about to witness is nothing short of extraordinary!",
  ],
  dramatic: [
    "In the silence between moments, a truth waits to be uncovered — and once seen, it cannot be unseen.",
    "There are stories that entertain, stories that inform, and then there are stories that change everything.",
    "Darkness. Light. The space between. This is where our story begins.",
  ],
  humorous: [
    "Okay, picture this: you're scrolling through your feed, minding your own business, and then — boom.",
    "If someone had told me this story a year ago, I would've laughed in their face. But here we are.",
    "Let's be honest — most videos start with something dramatic. I'm going to start with something ridiculous instead.",
  ],
};

const commercialHooks: Record<ScriptTone, string[]> = {
  professional: [
    "Every great achievement starts with a single decision — the decision to do things differently.",
    "In today's competitive landscape, the difference between good and extraordinary comes down to one thing.",
    "What separates the industry leaders from the rest? It's simpler than you think.",
  ],
  casual: [
    "Look, we've all been there — staring at the screen, wondering if there's a better way.",
    "You know that feeling when something just *clicks*? That's exactly what this is about.",
    "Real talk: what I'm about to share with you is a total game-changer.",
  ],
  energetic: [
    "Are you ready to transform the way you do things?! Because this is going to blow your mind!",
    "STOP everything you're doing — because you NEED to see this!",
    "This is NOT your average solution. This is THE solution you've been waiting for!",
  ],
  dramatic: [
    "They said it couldn't be done. They said it was impossible. They were wrong.",
    "In a world of endless options, one choice stands above the rest.",
    "The moment of truth. The point of no return. The decision that changes everything.",
  ],
  humorous: [
    "So, I tried to solve this problem the old-fashioned way. Spoiler alert: it didn't go well.",
    "You know what's worse than this problem? Nothing. Absolutely nothing. That's why we fixed it.",
    "What if I told you the answer was staring you in the face this whole time? Yeah, me too.",
  ],
};

const tutorialHooks: Record<ScriptTone, string[]> = {
  professional: [
    "Welcome to this comprehensive guide. By the end, you'll have mastered this essential skill.",
    "In today's tutorial, we'll walk through each step methodically to ensure complete understanding.",
    "Let's begin by establishing the fundamentals that will serve as the foundation for everything that follows.",
  ],
  casual: [
    "Hey there! Today I'm going to show you something really cool, and trust me, it's easier than you think.",
    "Alright, grab a coffee and get comfortable — we're about to dive into something awesome.",
    "So you want to learn this? Perfect, because I've got you covered with the simplest approach possible.",
  ],
  energetic: [
    "Let's GO! Today we're learning something absolutely incredible and I cannot WAIT to share it with you!",
    "Buckle up, because by the end of this tutorial, you're going to be an absolute PRO at this!",
    "This is going to be the BEST tutorial you've ever watched — let's get right into it!",
  ],
  dramatic: [
    "Every expert was once a beginner. Today, your transformation begins.",
    "The path to mastery is long, but every journey begins with a single, decisive step.",
    "What I'm about to teach you has the power to fundamentally shift your capabilities.",
  ],
  humorous: [
    "Remember that thing you've been avoiding learning? Yeah, that one. Well, it's time. And it's actually fun.",
    "I'll be honest — when I first tried this, I failed spectacularly. But that's exactly why this tutorial exists.",
    "Spoiler: this is easier than assembling IKEA furniture. And way more satisfying.",
  ],
};

const socialMediaHooks: Record<ScriptTone, string[]> = {
  professional: [
    "Three things you need to know — and number two will surprise you.",
    "Here's what the data shows, and why it matters for your next move.",
    "The strategy behind this approach is deceptively simple but incredibly effective.",
  ],
  casual: [
    "POV: you just discovered something that changes everything.",
    "No one talks about this, so I'm going to — here's what's really going on.",
    "Okay but can we just appreciate how amazing this is for a second?",
  ],
  energetic: [
    "THIS is why everyone is talking about this! Wait for it... 🤯",
    "You will NOT believe what happens next! This is absolutely INSANE!",
    "Stop scrolling! I promise you NEED to see this right NOW!",
  ],
  dramatic: [
    "Nobody saw this coming. And the implications are massive.",
    "This changes everything we thought we knew. Watch until the end.",
    "The truth is finally out. And it's more shocking than anyone expected.",
  ],
  humorous: [
    "Me: I'll just watch one video. Also me at 3 AM: *watching this on repeat*",
    "Tell me you didn't know about this without telling me you didn't know about this.",
    "I'm not saying this is life-changing, but I'm also not NOT saying that.",
  ],
};

const cinematicHooks: Record<ScriptTone, string[]> = {
  professional: [
    "In the vast expanse of human endeavor, there are moments that define generations.",
    "Time moves forward, relentless and unyielding, carrying with it the weight of every decision ever made.",
    "Some stories demand to be told. This is one of them.",
  ],
  casual: [
    "You know those moments that just stick with you? This is one of those.",
    "There's something about this that just hits different, you know?",
    "Sometimes the most ordinary moments turn out to be the most extraordinary.",
  ],
  energetic: [
    "THIS is the kind of footage that gives you chills! Absolute cinema!",
    "From the very first frame, you KNOW this is going to be epic!",
    "When the music hits and the visuals align — THIS is what it's all about!",
  ],
  dramatic: [
    "In the silence between heartbeats, between breaths, between moments — there lies a truth.",
    "Light bends. Time folds. And in the space between what was and what will be, we find ourselves.",
    "There are no accidents. Only paths we were always meant to walk.",
  ],
  humorous: [
    "If this were a movie, this is the part where the dramatic music kicks in.",
    "I'm not saying this is the greatest footage ever captured, but I'm also not NOT saying that.",
    "Plot twist: the real cinematic masterpiece was the video we uploaded along the way.",
  ],
};

function getHooks(style: ScriptStyle, tone: ScriptTone): string[] {
  const hookMap: Record<ScriptStyle, Record<ScriptTone, string[]>> = {
    documentary: documentaryHooks,
    commercial: commercialHooks,
    tutorial: tutorialHooks,
    'social-media': socialMediaHooks,
    cinematic: cinematicHooks,
  };
  return hookMap[style][tone];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBodyContent(style: ScriptStyle, tone: ScriptTone, description: string, duration: number): string[] {
  const topic = description || 'this incredible subject';
  const numSections = duration > 120 ? 3 : duration > 60 ? 2 : 1;
  const sections: string[] = [];

  const bodyTemplates: Record<ScriptStyle, Record<ScriptTone, string[][]>> = {
    documentary: {
      professional: [
        [
          `The story of ${topic} is one that spans decades, touching countless lives along the way. What began as a simple idea has evolved into something far greater than anyone could have imagined.`,
          `Research shows that ${topic} has experienced remarkable growth in recent years. Experts point to a convergence of factors — technological advancement, shifting cultural norms, and an ever-growing demand for innovation.`,
        ],
        [
          `But the journey hasn't been without its challenges. Industry pioneers faced skepticism, limited resources, and the constant pressure to prove their vision was viable.`,
          `Yet through perseverance and strategic thinking, these obstacles became stepping stones. Each challenge overcome added another layer of credibility and momentum to the movement.`,
        ],
        [
          `Today, the landscape looks dramatically different. ${topic} stands at the forefront of innovation, with new developments emerging at an unprecedented pace.`,
          `The question is no longer whether this transformation will happen — it's already happening. The real question is: how will you be part of it?`,
        ],
      ],
      casual: [
        [
          `So here's what's really going on with ${topic}. Turns out, it's way more fascinating than most people give it credit for.`,
          `When you dig beneath the surface, you start to see patterns and connections that completely change your perspective.`,
        ],
        [
          `And the stories people have? Absolutely wild. Like, you wouldn't believe some of the things that have happened behind the scenes.`,
          `But that's what makes this whole thing so compelling — it's real, it's raw, and it's happening right now.`,
        ],
        [
          `The bottom line? ${topic} is evolving fast, and honestly, it's a pretty exciting time to be paying attention.`,
          `Whether you're just discovering this or you've been following along for years, there's always something new to learn.`,
        ],
      ],
      energetic: [
        [
          `Let me tell you, ${topic} is absolutely EXPLODING right now and the numbers are mind-blowing!`,
          `We're talking about growth that's off the charts, innovation that's pushing boundaries, and a community that's more passionate than ever!`,
        ],
        [
          `And the people behind this? Absolute ROCKSTARS. Their dedication and vision are driving something truly special.`,
          `Every single day brings a new development, a new breakthrough, a new reason to be excited!`,
        ],
        [
          `This isn't just a trend — this is a MOVEMENT. And the momentum is absolutely unstoppable!`,
          `If you're not paying attention to ${topic} yet, NOW is the time to start!`,
        ],
      ],
      dramatic: [
        [
          `In the shadow of ${topic}, a quiet revolution has been unfolding — one that few have dared to acknowledge, and even fewer have truly understood.`,
          `The forces at play are ancient and relentless, shaping destinies and rewriting the rules of what we thought was possible.`,
        ],
        [
          `There are those who would have you believe this story is simple. They are wrong. Nothing about ${topic} is simple — and that is precisely what makes it so powerful.`,
          `Behind every statistic lies a human story. Behind every number, a name. Behind every headline, a truth waiting to be uncovered.`,
        ],
        [
          `And so we arrive at the present moment — a crossroads where past and future converge, where the weight of history meets the promise of tomorrow.`,
          `The story of ${topic} is far from over. In many ways, it has only just begun.`,
        ],
      ],
      humorous: [
        [
          `Alright, let's talk about ${topic}. And yes, I know what you're thinking — "How is this interesting?" Trust me, give it thirty seconds.`,
          `First of all, the history alone is wilder than a reality TV show. There are plot twists, betrayals, and at least one moment that'll make you spit out your coffee.`,
        ],
        [
          `But here's where it gets really good. The current state of ${topic} is basically a comedy of errors that somehow turned into a success story.`,
          `It's like watching someone trip up the stairs but somehow land on their feet at the top. Impressive? Yes. Confusing? Also yes.`,
        ],
        [
          `So what have we learned? That ${topic} is basically the underdog story we all needed, with enough twists to keep you guessing.`,
          `And if that doesn't convince you, I don't know what will. Maybe a cat video. Those usually work.`,
        ],
      ],
    },
    commercial: {
      professional: [
        [
          `At its core, ${topic} represents a fundamental shift in how we approach modern challenges. The data speaks for itself — organizations embracing this change are seeing remarkable results.`,
          `What sets ${topic} apart is its unique combination of innovation and practicality. It's not just theoretical — it's proven, measurable, and ready to implement.`,
        ],
        [
          `Consider the impact: streamlined processes, enhanced outcomes, and a competitive advantage that compounds over time. These aren't promises — they're results that speak for themselves.`,
          `The organizations leading their industries have one thing in common: they recognized the opportunity early and acted decisively.`,
        ],
        [
          `The time to act is now. Every day of hesitation is a day your competitors are moving forward.`,
          `Join the forward-thinking leaders who have already discovered the power of ${topic}. The results will speak for themselves.`,
        ],
      ],
      casual: [
        [
          `So here's the deal with ${topic} — it actually works. Like, really works. Not just "in theory" but in real life, with real results.`,
          `And the best part? It's way simpler than you'd expect. No complicated setups, no steep learning curves.`,
        ],
        [
          `Think about what you could accomplish if this particular headache just... went away. That's basically what we're offering here.`,
          `People who've tried it keep coming back with the same reaction: "Why didn't I do this sooner?"`,
        ],
        [
          `So what are you waiting for? ${topic} is ready when you are, and honestly, you'll wonder how you managed without it.`,
          `Take the leap. You won't regret it.`,
        ],
      ],
      energetic: [
        [
          `Listen up! ${topic} is taking the world by STORM and you do NOT want to miss out on this!`,
          `We're talking about something that's going to completely REVOLUTIONIZE the way you do things — and it's available RIGHT NOW!`,
        ],
        [
          `Thousands of people are already seeing INSANE results and the numbers keep growing!`,
          `This isn't hype — this is REAL, and the proof is everywhere you look! The testimonials! The results! The excitement is CONTAGIOUS!`,
        ],
        [
          `So what are you waiting for?! Don't be the last one to discover ${topic} — be the one who got in EARLY!`,
          `Click that button, make the move, and get ready for the best decision you've ever made! LET'S GO!`,
        ],
      ],
      dramatic: [
        [
          `For too long, the world has accepted the status quo. Accepted limitations. Accepted "good enough." But ${topic} changes everything.`,
          `This isn't an incremental improvement. This is a paradigm shift — a complete reimagining of what's possible.`,
        ],
        [
          `Every revolution begins with a single moment of clarity. That moment when you realize there's a better way, and there's no going back.`,
          `${topic} is that moment. It's the answer to a question you've been asking for longer than you realize.`,
        ],
        [
          `The choice is yours. Continue down the familiar path, or step into a future of limitless possibility.`,
          `${topic}. Because you deserve more than "good enough."`,
        ],
      ],
      humorous: [
        [
          `Okay, real talk — ${topic} is basically the cheat code you've been looking for. And no, I'm not exaggerating. Well, maybe a little. But not much.`,
          `Imagine solving that problem that's been annoying you forever. You know the one. Yeah, THAT one. This fixes it.`,
        ],
        [
          `And the best part? It doesn't require a PhD, a small loan, or a blood oath to use. It's actually simple. Revolutionary, I know.`,
          `My grandma could use this, and she still prints out her emails. That's how user-friendly we're talking here.`,
        ],
        [
          `So do yourself a favor and check out ${topic}. Your future self will thank you. Probably with a really nice gift basket.`,
          `Seriously though — try it. What have you got to lose? Besides that headache you've been dealing with.`,
        ],
      ],
    },
    tutorial: {
      professional: [
        [
          `Let's begin with the fundamentals. Understanding ${topic} requires a solid grasp of the core principles that drive its functionality.`,
          `The first key concept is the foundational framework. This serves as the backbone for everything we'll build upon in subsequent steps.`,
        ],
        [
          `Now let's move to the intermediate concepts. This is where ${topic} really begins to show its power and versatility.`,
          `Pay close attention to the configuration options here, as they'll determine the behavior and output of your final result.`,
        ],
        [
          `Finally, let's put it all together. By combining the foundational elements with the advanced techniques we've covered, you'll achieve a complete, working implementation.`,
          `Remember: practice and repetition are the keys to mastery. Don't hesitate to revisit earlier sections as needed.`,
        ],
      ],
      casual: [
        [
          `Alright, let's start with the basics of ${topic}. Don't worry — it's super straightforward once you see how it works.`,
          `First things first: let me show you the setup. It's actually way easier than most tutorials make it look.`,
        ],
        [
          `Now here's where it gets fun. We're going to take what we just learned and build something actually cool with it.`,
          `And the best part? You can totally customize this to fit whatever you're working on. It's like a template that actually works.`,
        ],
        [
          `And there you have it! You just learned ${topic} from scratch. Not too shabby, right?`,
          `Go ahead and experiment with it — the more you play around, the more cool stuff you'll discover. Happy creating!`,
        ],
      ],
      energetic: [
        [
          `Alright team, let's JUMP right in! ${topic} is super exciting and I'm going to walk you through EVERYTHING you need to know!`,
          `Step one is nice and easy — think of it as the warm-up before the main event! Let's GO!`,
        ],
        [
          `NOW we're cooking! This next part is where the magic happens and I'm SO excited to show you!`,
          `Watch closely because this technique is going to save you SO much time in the future!`,
        ],
        [
          `BOOM! You did it! You just mastered ${topic} and honestly, you should be PROUD of yourself!`,
          `Now go out there and CREATE something amazing! I can't WAIT to see what you come up with!`,
        ],
      ],
      dramatic: [
        [
          `Every master was once a beginner. And so your journey with ${topic} begins here, at the very foundation of knowledge.`,
          `Listen carefully, for these fundamentals will echo through everything you build from this day forward.`,
        ],
        [
          `Now we ascend to the intermediate realm — where raw knowledge transforms into practical power.`,
          `This is the crucible. The place where theory meets practice, and understanding deepens into mastery.`,
        ],
        [
          `And so your training is complete. But remember — this is not the end. It is merely the beginning of your journey with ${topic}.`,
          `Take what you have learned. Build. Create. Transform. The path ahead is yours to walk.`,
        ],
      ],
      humorous: [
        [
          `Welcome to the ${topic} tutorial! I promise it's less painful than a trip to the dentist. Mostly.`,
          `Step one: take a deep breath. Step two: forget everything you've read in confusing forums. Step three: follow along with ME instead.`,
        ],
        [
          `Now here's where most people panic. Don't panic. It looks complicated, but it's actually just three simple steps dressed up in fancy clothes.`,
          `Think of it like a burrito — complex on the outside, but inside? Just delicious, delicious simplicity.`,
        ],
        [
          `Congratulations! You just survived the ${topic} tutorial! And honestly? You crushed it. Gold star. A+. Parental approval.`,
          `Now go forth and use your newfound powers responsibly. Or don't. I'm a tutorial, not your mom.`,
        ],
      ],
    },
    'social-media': {
      professional: [
        [
          `Here are the key insights about ${topic} that industry leaders don't share publicly.`,
          `The strategy is straightforward but the execution is what separates the best from the rest.`,
        ],
        [
          `Data point number one: ${topic} has seen a significant shift in the past year alone.`,
          `And the implications? Enormous. Those who adapt quickly will reap the biggest rewards.`,
        ],
        [
          `Save this for later. Share it with someone who needs to hear it. The conversation around ${topic} is just getting started.`,
          `Follow for more insights like this. New content dropping daily.`,
        ],
      ],
      casual: [
        [
          `Okay so ${topic} is having a MOMENT right now and I need to talk about it.`,
          `Here's the thing nobody tells you — it's actually way more interesting than it sounds.`,
        ],
        [
          `Like, I went into this expecting to be bored and came out absolutely obsessed? Same.`,
          `And the best part is that literally anyone can get into it. No gatekeeping here.`,
        ],
        [
          `Drop a 🔥 if you're also into ${topic}. Let's see how many of us are out there.`,
          `Follow for more content like this — I've got SO many thoughts and I'm sharing them all.`,
        ],
      ],
      energetic: [
        [
          `STOP SCROLLING! You NEED to see this! ${topic} is absolutely UNREAL right now! 🔥🔥🔥`,
          `I'm literally SHAKING right now! This is the most exciting thing I've seen ALL YEAR!`,
        ],
        [
          `And it gets BETTER! Wait for it... wait for it... BOOM! 🤯🤯🤯`,
          `I told you this was going to be INSANE! And I was RIGHT! Tag someone who needs to see this!`,
        ],
        [
          `SHARE this with everyone you know! This is TOO GOOD to keep to yourself! 🚀`,
          `Follow for more MIND-BLOWING content! You do NOT want to miss what's coming next! 💥`,
        ],
      ],
      dramatic: [
        [
          `Nobody is talking about this. And that's exactly why you need to pay attention to ${topic}.`,
          `What I'm about to reveal will change the way you see this forever. The truth has been hidden in plain sight.`,
        ],
        [
          `The deeper you dig, the more unsettling it becomes. Every layer peels back to reveal something unexpected.`,
          `And the worst part? Most people will never know. But you will. You'll know.`,
        ],
        [
          `Watch this again. Share it before it gets taken down. Some truths are too important to stay buried.`,
          `${topic}. Remember that name. You'll be hearing it again soon.`,
        ],
      ],
      humorous: [
        [
          `Day 47 of posting about ${topic} until someone pays attention. Today might be the day. Probably not. But maybe.`,
          `My therapist said I should talk about my interests more, so here's a thread about ${topic}. You're welcome, therapist.`,
        ],
        [
          `Me: I should be productive. Also me: *spends 3 hours deep-diving into ${topic}*`,
          `Is this hyperfixation or passion? Asking for a friend. The friend is me.`,
        ],
        [
          `If this gets 10 likes I'll do a follow-up. If it gets 100 likes I'll lose my mind. In a good way.`,
          `Thanks for coming to my TED talk about ${topic}. There will be no Q&A because I don't have answers. Only vibes.`,
        ],
      ],
    },
    cinematic: {
      professional: [
        [
          `There is a rhythm to ${topic} — a cadence that echoes through time, resonating with those who take a moment to listen.`,
          `In the interplay of light and shadow, we find meaning. In the space between moments, we discover truth.`,
        ],
        [
          `The visual language speaks volumes. Every frame carefully composed, every transition purposefully crafted to guide the viewer through an emotional journey.`,
          `This is not merely content — it is an experience, designed to move, to inspire, to transform.`,
        ],
        [
          `And as the final frame fades to black, we are left with something rare: a feeling that lingers, a memory that endures.`,
          `${topic}. Seen through new eyes. Felt with an open heart.`,
        ],
      ],
      casual: [
        [
          `Sometimes you just need to step back and appreciate the beauty in ${topic}. Like, really look at it. Pretty cool, right?`,
          `There's something almost magical about how it all comes together — like a perfectly timed sunset that nobody planned.`,
        ],
        [
          `And the details! Don't even get me started on the details. Once you notice them, you can't un-notice them.`,
          `It's like the whole thing was orchestrated by some invisible hand, arranging everything just so.`,
        ],
        [
          `Anyway, that's ${topic} through my eyes. Hope you enjoyed the view as much as I did.`,
          `Sometimes the best stories don't need words. Just a moment, and someone willing to watch.`,
        ],
      ],
      energetic: [
        [
          `OH WOW! The visuals on ${topic} are ABSOLUTELY STUNNING! Like, cinema-level GORGEOUS!`,
          `Every single frame is a MASTERPIECE! The colors! The composition! The movement! ALL OF IT!`,
        ],
        [
          `And when that moment hits — you know THE moment — it sends CHILLS down your spine!`,
          `This is what peak visual storytelling looks like and I am HERE for it!`,
        ],
        [
          `An absolute FEAST for the eyes! ${topic} delivers on every level and then some!`,
          `If this doesn't get you hyped, I don't know what will! PURE VISUAL PERFECTION! 🎬`,
        ],
      ],
      dramatic: [
        [
          `In the beginning, there was silence. And in that silence, a vision took shape — ${topic}, waiting patiently for its moment.`,
          `Through the lens of time, every frame becomes a memory. Every cut, a heartbeat. Every transition, a breath between worlds.`,
        ],
        [
          `The light bends. Shadows dance. And somewhere in the space between what is shown and what is felt, a story emerges — raw, unfiltered, alive.`,
          `We do not merely observe ${topic}. We inhabit it. We breathe its air, feel its weight, carry its meaning.`,
        ],
        [
          `And as the credits roll on this chapter, one truth remains: the most powerful stories are not the ones told with words, but the ones felt in silence.`,
          `${topic}. A vision. A feeling. A moment suspended in time.`,
        ],
      ],
      humorous: [
        [
          `If ${topic} were a movie, it would win Best Picture. And also Best Actor. And honestly, Best Snack Table, because the catering was exceptional.`,
          `Cue the dramatic music. Roll the sweeping drone shots. Add a thoughtful voiceover. Boom — cinema.`,
        ],
        [
          `The director's vision was clear: make it epic. The budget said: make it cheap. The result? Absolute accidental genius.`,
          `It's giving "Oscar-worthy performance on a YouTube budget" and honestly? That's a vibe.`,
        ],
        [
          `And scene. That's a wrap on ${topic}. I'd like to thank the Academy, my camera, and the coffee that made this all possible.`,
          `10/10 would film again. Would also watch again. Would also probably cry again. But like, in a good way.`,
        ],
      ],
    },
  };

  for (let i = 0; i < numSections; i++) {
    const templateGroup = bodyTemplates[style][tone][i] || bodyTemplates[style][tone][0];
    const paragraphs = templateGroup.map(t =>
      t.replace('${topic}', topic)
    );
    sections.push(paragraphs.join('\n\n'));
  }

  return sections;
}

function generateOutro(style: ScriptStyle, tone: ScriptTone, description: string): string {
  const topic = description || 'this journey';
  const outros: Record<ScriptStyle, Record<ScriptTone, string>> = {
    documentary: {
      professional: `As we look to the future of ${topic}, one thing is clear: the story is far from over. What comes next will be shaped by the choices we make today. Thank you for joining us on this exploration.`,
      casual: `And that's the story! Pretty wild, right? ${topic} just keeps getting more interesting, and I for one can't wait to see what happens next. Thanks for hanging out — see you in the next one!`,
      energetic: `WOW, what an incredible journey through ${topic}! If this didn't get you pumped, I don't know what will! Share this with someone who needs to hear it, and I'll catch you in the next episode!`,
      dramatic: `And so the thread of ${topic} continues to unwind, stretching beyond the horizon, into the unknown. Some stories have endings. This one has only beginnings.`,
      humorous: `So there you have it — ${topic}, explained in a way that hopefully didn't put you to sleep. If it did, well, at least I tried. Sweet dreams, and thanks for watching!`,
    },
    commercial: {
      professional: `Discover the full potential of ${topic} today. Visit our website to learn more and take the first step toward transformation. The future is waiting.`,
      casual: `So yeah, that's ${topic} in a nutshell. Pretty sweet deal, right? Head over to the link and see for yourself — you won't be disappointed. Catch you later!`,
      energetic: `What are you waiting for?! Head to the link RIGHT NOW and start your ${topic} journey TODAY! This is your moment — SEIZE IT!`,
      dramatic: `The choice has always been yours. ${topic} is the bridge between where you are and where you're meant to be. Cross it. The other side is waiting.`,
      humorous: `So go ahead, give ${topic} a try. Worst case scenario, nothing changes. Best case? Everything changes. Medium case? You get a mildly interesting story for your next dinner party.`,
    },
    tutorial: {
      professional: `That concludes our tutorial on ${topic}. Review the key concepts, practice the techniques, and don't hesitate to revisit sections as needed. Thank you for your time and attention.`,
      casual: `And that's a wrap! You're now officially equipped to tackle ${topic} like a pro. Go build something awesome, and don't forget to like and subscribe for more tutorials!`,
      energetic: `You DID it! You conquered ${topic}! Now go out there and CREATE something AMAZING! Don't forget to like, subscribe, and hit that notification bell for MORE awesome content!`,
      dramatic: `The knowledge is now yours. ${topic} has been unlocked within you. Carry it forward with purpose, with passion, with the understanding that mastery is a journey, not a destination.`,
      humorous: `Congrats, you survived the ${topic} tutorial! Your reward? The warm, fuzzy feeling of accomplishment. And possibly a skill you can flex at parties. You're welcome.`,
    },
    'social-media': {
      professional: `That's the inside scoop on ${topic}. Like, share, and follow for more expert analysis. Link in bio for the full breakdown.`,
      casual: `Anyway, that's my take on ${topic}. What do YOU think? Drop a comment below and let's chat! Don't forget to follow for more content like this! ✌️`,
      energetic: `TAG someone who NEEDS to see this! SHARE it everywhere! ${topic} is going VIRAL and you're seeing it HERE first! 🔥🔥🔥`,
      dramatic: `Remember what you saw today. ${topic} is just the beginning. Follow me for the full story — because the truth deserves to be told.`,
      humorous: `If you made it this far, you legally have to like this post. Those are the rules, I don't make them. (I do make them.) Thanks for reading my ${topic} rant! 😂`,
    },
    cinematic: {
      professional: `As the light fades and the credits roll, we carry with us the essence of ${topic} — a vision captured in time, an experience etched in memory.`,
      casual: `And... scene. That's ${topic} through our lens. Hope it hit as hard for you as it did for us. Until next time, keep watching the world with curious eyes.`,
      energetic: `And THAT'S a WRAP! ${topic} delivered ABSOLUTE CINEMA and I am LIVING for it! Drop a comment with your favorite moment! 🎬🔥`,
      dramatic: `In the end, all that remains is the image. The feeling. The memory of ${topic}, suspended in amber, waiting to be felt once more. Fade to black.`,
      humorous: `Cue standing ovation. ${topic} just won Best Picture in my heart. The Academy may disagree, but what do they know? They picked Green Book that one time.`,
    },
  };

  const outroText = outros[style][tone];
  return typeof outroText === 'string' ? outroText : outroText[0];
}

export function generateScript(options: ScriptOptions): GeneratedScript {
  const { style, tone, audience, description, duration, fileName } = options;
  const hooks = getHooks(style, tone);
  const hook = pickRandom(hooks);
  const bodySections = generateBodyContent(style, tone, description, duration);
  const outro = generateOutro(style, tone, description);

  const sections: ScriptSection[] = [];
  let currentTime = 0;

  // Calculate time allocation
  const hookDuration = Math.max(5, duration * 0.1);
  const outroDuration = Math.max(5, duration * 0.15);
  const bodyTotalDuration = duration - hookDuration - outroDuration;
  const bodySectionDuration = bodySections.length > 0 ? bodyTotalDuration / bodySections.length : 0;

  // Hook section
  sections.push({
    id: 'hook',
    label: 'Hook / Opening',
    timestamp: `0:00 — ${formatDuration(Math.floor(hookDuration))}`,
    content: hook,
  });
  currentTime = hookDuration;

  // Body sections
  const bodyLabels = ['Main Content — Part 1', 'Main Content — Part 2', 'Main Content — Part 3', 'Key Details & Evidence', 'Supporting Examples', 'Deep Dive'];
  bodySections.forEach((content, i) => {
    const sectionEnd = currentTime + bodySectionDuration;
    sections.push({
      id: `body-${i}`,
      label: bodyLabels[i] || `Section ${i + 1}`,
      timestamp: `${formatDuration(Math.floor(currentTime))} — ${formatDuration(Math.floor(sectionEnd))}`,
      content,
    });
    currentTime = sectionEnd;
  });

  // Outro section
  sections.push({
    id: 'outro',
    label: 'Closing / Call to Action',
    timestamp: `${formatDuration(Math.floor(currentTime))} — ${formatDuration(duration)}`,
    content: outro,
  });

  const allText = sections.map(s => s.content).join(' ');
  const totalWords = allText.split(/\s+/).length;
  const estimatedDuration = formatDuration(duration);

  const audienceText = audience ? `Tailored for: ${audience}` : 'General audience';
  const notes = `Script generated for "${fileName}" in ${style} style with a ${tone} tone. ${audienceText}. Estimated reading pace: ~150 words/minute. Adjust timing as needed for natural delivery.`;

  return {
    title: `Voiceover Script — ${style.charAt(0).toUpperCase() + style.slice(1)} Style`,
    sections,
    totalWords,
    estimatedDuration,
    notes,
  };
}
