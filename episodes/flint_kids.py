"""Episode 3, told by Grandpa Flint: What was it like to be a child 30,000 years ago?

The same researched story and shots as kids.py, retold in the host's voice (first person, jokes, asides,
questions to the viewer), with full shots of Flint by his fire at the start, between parts and at the end,
and his round corner frame everywhere else. Acted voice (Gemini TTS, one take per part) and shaders.
"""
from episodes.kids import FACTS as _F, LINES as K

HOST = True          # Grandpa Flint narrates on screen (host.tsx)
ACTED = True         # expressive voice: ink_episode.acted_voice
SHADERS = True       # painted WebGL skies, rock, firelight, paper wash
VOICE = "Gacrux"     # Gemini's mature voice

FACTS = {**_F, "Cave of Altamira": _F["Cave of Altamira"] + ["depicting a herd of extinct steppe bison"]}


def shot(i, **change):
    """kids.py's shot for line i, optionally changed."""
    return {**K[i][2], **change}


def fire_scene(mood="happy", pose="sit", chapter=None, big=None, extra=None, bg="savanna-night"):
    s = {"bg": bg, "glow": True, "zoom": [1.0, 1.05], "focus": [900, 700],
         "actors": [{"who": "flint", "x": 800, "y": 1000, "s": 1.9, "pose": pose, "mood": mood, "look": 1}],
         "props": [{"k": "fire", "x": 1230, "y": 970, "s": 1.0}] + (extra or [])}
    if chapter:
        s["chapter"] = chapter
    if big:
        s["big"] = big
    return s


LINES = [
    ("Ah, you're here! Sit down, sit down. I'm Grandpa Flint, and tonight's story is about kids.", "hook",
     fire_scene(extra=[], big={"text": "GRANDPA FLINT", "word": "Flint", "y": 140, "size": 90, "light": True})),
    ("Not your kids. Stone Age kids!", "joke", None),
    ("More than twenty thousand years ago, someone walked across a muddy lakeshore, in what is now New Mexico.", "walk", shot(0)),
    ("And we know that, because their footprints are still there!", "reveal", shot(1)),
    ("Look closely. They walked for over a mile, carrying a very young child.", "walk", shot(2)),
    ("Every now and then, they put the little one down. See? Tiny footprints, right beside the big ones.", "reveal",
     shot(3, actors=[{**a, "word": "little"} if a["who"] == "kid" else a for a in K[3][2]["actors"]])),
    ("Then up again. And here, whoops! They slipped, carrying all that extra weight. I've done that. Many times.", "joke", shot(4)),
    ("Then the big footprints come back the other way... alone.", "stop", shot(5)),
    ("The toddler stayed behind, at the end of the trail.", "cold", shot(6)),
    ("And here's what really gets me. Most of the footprints out there were made by teenagers and children.", "reveal", shot(7)),
    ("So, tonight's question: what was it actually like, being a kid in the Stone Age?", "question",
     fire_scene(mood="wow", big={"text": "BEING A KID IN THE STONE AGE", "at": 0.25, "y": 140, "size": 84, "light": True})),

    ("Let's start with the scary part. Hold on to something!", "hush", shot(9)),
    ("About two and a half million years ago, in southern Africa, a small child, about three or four years old, died.", "walk", shot(10)),
    ("Scientists call this skull the Taung Child.", "reveal", shot(11)),
    ("Now look at the eye sockets. See those marks? Like talons.", "hush", shot(12)),
    ("The Taung Child was probably killed by an eagle!", "stop", shot(13)),
    ("So when you were very small, danger could come from the sky. Keep looking up, little ones.", "hush", shot(14)),

    ("Made it past that? Good. Because next, you had to grow up fast.", "walk", shot(15)),
    ("In Kenya, scientists found the skeleton of a Homo erectus youth, about one and a half million years old.", "reveal", shot(16)),
    ("They call him the Nariokotome Boy. The most complete Homo erectus skeleton ever found!", "walk", shot(17)),
    ("And he was only somewhere between seven and eleven years old.", "reveal", shot(18)),
    ("No school. No books. No homework! Lucky... So how did kids learn anything?", "joke",
     fire_scene(pose="point", mood="happy", extra=[{"k": "book", "x": 1560, "y": 520, "s": 0.8, "word": "books"},
                                                    {"k": "question", "x": 1560, "y": 300, "from": [1100, 520], "word": "learn"}])),

    ("Well, some of the answers are drawn right on cave walls.", "walk", shot(20)),
    ("In Rouffignac Cave, in France, the walls and ceilings are covered in finger lines.", "walk", shot(21)),
    ("In 2011, researchers measured how wide those fingers were.", "reveal", shot(22)),
    ("And many of the lines were made by children! Some as young as three.", "stop", shot(23)),
    ("Some lines are so high up, the kids may have been held up to reach them.", "walk", shot(24)),
    ("Imagine a parent lifting a toddler to the ceiling. Go on, draw something!", "joke", shot(25)),
    ("In Chauvet Cave, also in France, a child left something else behind.", "walk", shot(26)),
    ("Footprints, from 27,000 to 25,000 years ago, right next to smoke stains from torches.", "reveal", shot(27)),
    ("A kid, walking deep into a dark cave, by torchlight. Brave little thing.", "hush", shot(28)),
    ("Those might be the oldest human footprints that can be accurately dated.", "reveal", shot(29)),
    ("And yes! Stone Age kids had toys.", "joke", shot(30)),
    ("In China, in the grave of a four-year-old girl, archaeologists found three stone balls.", "reveal", shot(31)),
    ("They're one of the earliest known examples of children's toys.", "walk", shot(32)),
    ("And the oldest known doll? About 4,000 years old. Practically brand new, by my standards!", "joke", shot(33)),

    ("Now... this next part always gets me.", "hush", fire_scene(mood="worried", chapter="PART 4 · LOVED", bg="village-night")),
    ("At Sungir, over 30,000 years ago, two young adolescents were buried, head to head.", "walk", shot(35)),
    ("They were covered in ivory beads. More than thirteen thousand of them.", "reveal", shot(36)),
    ("Making that many beads would take about ten thousand hours of work. Years of somebody's life.", "walk", shot(37)),
    ("Whoever these children were... someone loved them very, very much.", "payoff", shot(38)),

    ("Oh, and one more thing! Kids are still making discoveries.", "joke", fire_scene(pose="wave", mood="happy")),
    ("In 1879, an eight-year-old girl named María led her father into a cave in northern Spain.", "walk", shot(40)),
    ("And her father realized the markings on the walls were drawings.", "reveal", shot(41)),
    ("That cave was Altamira. Its ceiling is painted with a whole herd of extinct bison.", "payoff", shot(42)),
    ("Kids made the art. And a kid helped find it.", "payoff", shot(43)),
    ("So next time a kid draws on the wall... well. They're just doing what kids have always done!", "joke", shot(44)),
    ("What would you have played with, as a Stone Age kid? Tell me in the comments!", "question",
     fire_scene(pose="point", mood="wow", extra=[{"k": "stoneballs", "x": 1560, "y": 960, "s": 0.9},
                                                  {"k": "question", "x": 1560, "y": 380, "from": [1100, 560], "at": 0.3}])),
    ("And subscribe, so you never miss one of my stories. Goodnight!", "cta",
     shot(46, actors=K[46][2]["actors"] + [{"who": "flint", "x": 420, "y": 960, "s": 1.3, "pose": "wave", "mood": "happy", "look": 1}])),
]
MOODS = {}

META = {
    "title": "What Was It Like to Be a Child 30,000 Years Ago?",
    "description": (
        "Grandpa Flint tells the true story of Stone Age childhood - from footprints, skulls, cave walls and graves.\n\n"
        "- White Sands footprints (21,000-23,000 years ago): a grown-up carried a very young child over a mile, set it down, "
        "slipped, and walked back alone; most prints there were made by teenagers and children\n"
        "- The Taung Child (2.58 million years ago, age 3-4) was probably killed by an eagle - talon marks in the eye sockets\n"
        "- The Nariokotome Boy (1.5-1.6 million years ago, age 7-11), the most complete Homo erectus skeleton ever found\n"
        "- Rouffignac Cave: many finger flutings were made by children as young as three, some perhaps held up to reach\n"
        "- Chauvet Cave: a child's footprints (27,000-25,000 years ago) beside torch smoke stains\n"
        "- Three stone balls in a four-year-old girl's grave at Banpo - among the earliest known toys\n"
        "- Sungir: two adolescents buried head-to-head with more than 13,000 beads (about 10,000 hours of work)\n"
        "- 1879: eight-year-old María led her father into the cave of Altamira, with its herd of painted bison\n\n"
        "What would you have played with as a Stone Age kid? Tell me in the comments.\n\n"
        "#history #prehistory #stoneage #archaeology"),
    "tags": ["stone age children", "prehistoric children", "what was it like to be a child in the stone age", "ancient humans",
             "white sands footprints", "taung child", "nariokotome boy", "cave art children", "altamira", "chauvet cave",
             "sungir", "human history", "animated history", "story time", "grandpa flint"],
    "thumb": ["STONE AGE", "KIDS?"],
}
