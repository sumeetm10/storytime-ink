"""Episode 3 (high effort, written by hand): What was it like to be a child 30,000 years ago?

Cold open on the White Sands footprints (a grown-up carrying a toddler for over a mile, slipping,
then walking back alone), then four parts - the danger (the Taung Child and the eagle), growing up
fast (the Nariokotome Boy), play and art (finger lines by three-year-olds, a child's torch-lit
footprints in Chauvet, stone toy balls), loved (the Sungir children and their 13,000 beads) - and
the twist: an eight-year-old girl led her father to the paintings of Altamira.
Shot format: see episodes/sleep.py.
"""

FACTS = {
    "White Sands fossil footprints": ["between 21,000 and 23,000 years ago", "walking with a very young child for over a mile",
                                      "sometimes carried the child and then set it down", "slipping as he or she carried the additional weight",
                                      "made a round trip journey while leaving the toddler at the destination",
                                      "the vast majority of the prints were made by teenagers and children"],
    "Taung Child": ["2.58 million years", "about three or four", "talon marks in the eyes",
                    "probably was killed by an eagle or other large predatory bird"],
    "Nariokotome Boy": ["Homo erectus youth who lived 1.5 to 1.6 million years ago", "most complete Homo erectus skeleton ever found",
                        "Kenya", "range from 7 to 11 years old"],
    "Rouffignac Cave": ["finger flutings", "In September 2011", "children as young as three years old"],
    "Finger fluting": ["young children aged 2–5 in Paleolithic art and who may have been held up to do this"],
    "Chauvet Cave": ["a child's footprints", "carbon smoke stains from torches that lit the caves", "27,000 to 25,000 years ago",
                     "oldest human footprints that can be accurately dated"],
    "Toy": ["three stone balls found in the tomb of a four-year-old girl", "One of the earliest examples of children's toys",
            "The oldest known doll toy is thought to be 4,000 years old"],
    "Sungir": ["two adolescent children in Grave 2, placed head-to-head", "More than 13,000 beads", "10,000 hours", "30,500 and 30,000 BCE"],
    "Cave of Altamira": ["In 1879", "eight-year-old daughter María", "markings on the walls constituted drawings"],
}
DERIVED = "10,000 hours of work = over 3 years at 8 hours a day; 30,000 BCE = about 32,000 years ago ('over 30,000 years ago')."

PL = "playa"
TRAIL = {"x": 140, "y": 900, "x1": 1780, "y1": 860, "n": 20}
LINES = [
    # ---------------------------------------------------------------- cold open: the footprints
    ("More than twenty thousand years ago, someone walked across a muddy lakeshore in what is now New Mexico.", "hook", {
        "bg": PL, "zoom": [1.0, 1.05],
        "actors": [{"who": "mom", "x": -120, "y": 900, "s": 1.25, "pose": "walk", "mood": "neutral", "look": 1, "to": [760, 900], "move": [0.0, 1.0]}],
        "props": [{"k": "footprints", **TRAIL, "walk": [0.0, 0.45]}],
        "tags": [{"text": "NEW MEXICO · 21,000-23,000 YEARS AGO", "x": 960, "y": 160, "at": 0.5, "size": 42}]}),
    ("We know, because their footprints are still there.", "reveal", {
        "bg": PL, "zoom": [1.15, 1.0], "focus": [700, 880],
        "props": [{"k": "footprints", **TRAIL, "walk": [-1, 0.0]}],
        "tags": [{"text": "FOSSIL FOOTPRINTS", "x": 960, "y": 200, "at": 0.3, "size": 56, "color": "red"}]}),
    ("They walked for over a mile, carrying a very young child.", "walk", {
        "bg": PL,
        "actors": [{"who": "mom", "x": 300, "y": 900, "s": 1.3, "pose": "hold", "carry": "toddler", "mood": "happy", "look": 1,
                    "to": [1300, 900], "move": [0.0, 1.0]}],
        "props": [{"k": "footprints", **TRAIL, "walk": [0.0, 0.6]}],
        "tags": [{"text": "OVER A MILE", "x": 1500, "y": 220, "word": "mile", "size": 54}]}),
    ("Sometimes they set the child down, and tiny footprints appear beside the big ones.", "reveal", {
        "bg": PL, "zoom": [1.0, 1.08], "focus": [960, 900],
        "actors": [{"who": "mom", "x": 860, "y": 900, "s": 1.3, "pose": "walk", "mood": "happy", "look": 1, "to": [1260, 900], "move": [0.35, 1.0]},
                   {"who": "kid", "x": 980, "y": 960, "s": 0.85, "pose": "walk", "mood": "happy", "look": 1, "to": [1380, 960], "move": [0.35, 1.0], "word": "child"}],
        "props": [{"k": "footprints", **TRAIL, "kid": [0.45, 0.75], "walk": [0.3, 0.9]}],
        "tags": [{"text": "TODDLER", "x": 1400, "y": 700, "word": "tiny", "size": 44, "color": "red"}]}),
    ("Then they picked the child up again. And in places, they slipped, carrying the extra weight.", "walk", {
        "bg": PL,
        "actors": [{"who": "mom", "x": 1100, "y": 900, "s": 1.3, "pose": "hold", "carry": "toddler", "mood": "happy", "look": 1,
                    "then": {"at": 0.55, "pose": "scared", "mood": "scared"}}],
        "props": [{"k": "footprints", **TRAIL, "kid": [0.45, 0.6], "slips": [12, 13], "walk": [0.4, 0.8]}],
        "tags": [{"text": "SLIP!", "x": 1560, "y": 520, "word": "slipped", "size": 60, "color": "red", "rot": -8}]}),
    ("Then the big footprints come back the other way. Alone.", "stop", {
        "bg": PL, "zoom": [1.0, 1.06],
        "actors": [{"who": "mom", "x": 1700, "y": 900, "s": 1.25, "pose": "walk", "mood": "neutral", "look": -1, "flip": True,
                    "to": [700, 900], "move": [0.1, 1.0]}],
        "props": [{"k": "footprints", **TRAIL, "kid": [0.45, 0.6], "slips": [12, 13]},
                  {"k": "footprints", "x": 1780, "y": 960, "x1": 400, "y1": 980, "n": 18, "walk": [0.1, 0.9]}],
        "tags": [{"text": "ALONE", "x": 960, "y": 220, "word": "Alone", "size": 64}]}),
    ("The toddler had been left at the end of the trail.", "cold", {
        "bg": PL, "zoom": [1.0, 1.1], "focus": [1650, 820],
        "actors": [{"who": "kid", "x": 1650, "y": 930, "s": 0.95, "pose": "wave", "mood": "happy", "look": -1}],
        "props": [{"k": "hut", "x": 1460, "y": 900, "s": 0.8}]}),
    ("And here's the strangest part. Most of the footprints found there were made by teenagers and children.", "reveal", {
        "bg": PL,
        "props": [{"k": "footprints", "x": 120, "y": 760, "x1": 1800, "y1": 720, "n": 22, "onlyKid": True, "kid": [0, 1], "walk": [0.1, 0.5]},
                  {"k": "footprints", "x": 1800, "y": 880, "x1": 120, "y1": 940, "n": 22, "onlyKid": True, "kid": [0, 1], "walk": [0.25, 0.65]},
                  {"k": "footprints", "x": 120, "y": 1010, "x1": 1800, "y1": 1000, "n": 22, "walk": [0.4, 0.8]}],
        "tags": [{"text": "MOSTLY KIDS", "x": 960, "y": 220, "word": "teenagers", "size": 64, "color": "red"}]}),
    ("So what was it actually like, to be a kid in the Stone Age?", "question", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 960, "y": 990, "s": 1.6, "pose": "think", "mood": "wow", "look": 1}],
        "big": {"text": "BEING A KID IN THE STONE AGE", "at": 0.05, "y": 150, "size": 96}}),

    # ---------------------------------------------------------------- part 1: danger
    ("Let's start with the scary part.", "stop", {
        "bg": "savanna-night", "chapter": "PART 1 · DANGER",
        "actors": [{"who": "kid", "x": 900, "y": 960, "s": 1.5, "pose": "scared", "mood": "scared", "look": 1}],
        "props": [{"k": "eyes", "x": 1500, "y": 820, "at": 0.3}]}),
    ("About two and a half million years ago, in southern Africa, a small child, about three or four years old, died.", "walk", {
        "bg": "dusk", "zoom": [1.0, 1.05],
        "actors": [{"who": "hominin", "x": 760, "y": 960, "s": 1.0, "pose": "wave", "mood": "happy", "look": 1},
                   {"who": "kid", "x": 1080, "y": 980, "s": 1.05, "pose": "walk", "mood": "happy", "look": -1}],
        "tags": [{"text": "2.58 MILLION YEARS AGO", "x": 960, "y": 170, "at": 0.15, "size": 50},
                 {"text": "AGE 3-4", "x": 1300, "y": 640, "word": "three", "size": 50, "color": "red"}]}),
    ("Scientists call the skull the Taung Child.", "reveal", {
        "bg": "paper",
        "props": [{"k": "draw-skull", "x": 960, "y": 560}],
        "tags": [{"text": "THE TAUNG CHILD", "x": 960, "y": 170, "word": "Taung", "size": 60}]}),
    ("And around its eye sockets, there are marks, like the marks of talons.", "walk", {
        "bg": "paper", "zoom": [1.0, 1.25], "focus": [960, 520],
        "props": [{"k": "draw-skull", "x": 960, "y": 560, "talons": True}],
        "tags": [{"text": "TALON MARKS", "x": 1450, "y": 300, "word": "talons", "size": 52, "color": "red"}]}),
    ("The Taung Child was probably killed by an eagle.", "stop", {
        "bg": "dusk", "zoom": [1.0, 1.06],
        "props": [{"k": "eagle", "x": 2200, "y": 120, "to": [1100, 560], "move": [0.05, 0.75], "s": 1.3, "flip": True}],
        "actors": [{"who": "kid", "x": 900, "y": 980, "s": 1.0, "pose": "scared", "mood": "scared", "look": 1, "word": "Child"}],
        "tags": [{"text": "AN EAGLE", "x": 520, "y": 220, "word": "eagle", "size": 60, "color": "red"}]}),
    ("For the smallest humans, danger could come from the sky.", "cold", {
        "bg": "dusk",
        "actors": [{"who": "hominin2", "x": 820, "y": 970, "s": 1.25, "pose": "hold", "carry": "toddler", "mood": "worried", "look": 1}],
        "props": [{"k": "eagle", "x": 1500, "y": 260, "s": 0.6, "flip": True}]}),

    # ---------------------------------------------------------------- part 2: growing up fast
    ("If you survived, you had to grow up fast.", "walk", {
        "bg": "savanna-night", "chapter": "PART 2 · GROWING UP FAST", "glow": True,
        "actors": [{"who": "kid", "x": 760, "y": 990, "s": 1.25, "pose": "feed", "mood": "neutral", "look": 1}],
        "props": [{"k": "fire", "x": 1000, "y": 980, "s": 0.9}]}),
    ("In Kenya, scientists found the skeleton of a Homo erectus youth, about one and a half million years old.", "reveal", {
        "bg": "paper",
        "props": [{"k": "skeleton", "x": 1000, "y": 600, "s": 1.6, "word": "skeleton"}],
        "tags": [{"text": "KENYA", "x": 520, "y": 200, "word": "Kenya", "size": 54},
                 {"text": "1.5 MILLION YEARS", "x": 1360, "y": 200, "word": "million", "size": 50, "color": "red"}]}),
    ("It's called the Nariokotome Boy, the most complete Homo erectus skeleton ever found.", "walk", {
        "bg": "paper",
        "props": [{"k": "skeleton", "x": 1000, "y": 620, "s": 1.6}, {"k": "magnifier", "x": 700, "y": 600, "at": 0.4}],
        "tags": [{"text": "NARIOKOTOME BOY", "x": 960, "y": 170, "word": "Nariokotome", "size": 56},
                 {"text": "MOST COMPLETE EVER", "x": 960, "y": 900, "word": "complete", "size": 48, "color": "red"}]}),
    ("He was somewhere between seven and eleven years old.", "reveal", {
        "bg": "paper",
        "actors": [{"who": "hominin", "x": 960, "y": 990, "s": 1.25, "pose": "stand", "mood": "neutral", "look": 0}],
        "big": {"text": "AGE 7-11", "word": "seven", "y": 200, "size": 120}}),
    ("There were no schools, and no books. So how did kids learn?", "question", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 760, "y": 990, "s": 1.3, "pose": "think", "mood": "wow", "look": 1}],
        "props": [{"k": "book", "x": 1300, "y": 600, "s": 0.8}, {"k": "question", "x": 960, "y": 360, "from": [800, 560], "at": 0.6}],
        "tags": [{"text": "NO SCHOOL", "x": 1300, "y": 420, "word": "schools", "size": 46, "color": "red", "rot": -6}]}),

    # ---------------------------------------------------------------- part 3: play and art
    ("Some of the answers are drawn on cave walls.", "walk", {
        "bg": "cave-night", "chapter": "PART 3 · PLAY AND ART", "glow": True,
        "props": [{"k": "torch", "x": 520, "y": 900, "s": 1.0}, {"k": "flutings", "x": 1000, "y": 420, "draw": [0.2, 1.0], "seed": 3}]}),
    ("In Rouffignac Cave, in France, the walls and ceilings are covered in finger lines.", "walk", {
        "bg": "cave-night", "glow": True, "zoom": [1.0, 1.08],
        "props": [{"k": "torch", "x": 300, "y": 920}, {"k": "flutings", "x": 760, "y": 300, "seed": 5}, {"k": "flutings", "x": 1200, "y": 460, "draw": [0.3, 1.0], "seed": 9}],
        "tags": [{"text": "ROUFFIGNAC · FRANCE", "x": 960, "y": 120, "word": "Rouffignac", "size": 48}]}),
    ("In 2011, researchers measured how wide the fingers were.", "reveal", {
        "bg": "paper",
        "props": [{"k": "flutings", "x": 960, "y": 520, "seed": 5}, {"k": "magnifier", "x": 960, "y": 520, "at": 0.3}],
        "tags": [{"text": "2011", "x": 400, "y": 200, "word": "2011", "size": 60}, {"text": "FINGER WIDTH", "x": 1400, "y": 860, "word": "wide", "size": 46}]}),
    ("Many of the lines were made by children. Some as young as three.", "stop", {
        "bg": "cave-night", "glow": True,
        "actors": [{"who": "kid", "x": 900, "y": 990, "s": 1.0, "pose": "point", "mood": "happy", "look": 1}],
        "props": [{"k": "torch", "x": 420, "y": 940}, {"k": "flutings", "x": 1250, "y": 640, "small": True, "draw": [0.1, 0.9], "seed": 11}],
        "big": {"text": "AGE 3", "word": "three", "y": 160, "size": 120, "light": True}}),
    ("Some lines are so high up, the kids may have been held up to reach them.", "walk", {
        "bg": "cave-night", "glow": True, "zoom": [1.0, 1.06], "focus": [960, 420],
        "actors": [{"who": "dad", "x": 900, "y": 990, "s": 1.25, "pose": "hold", "carry": "toddler", "mood": "happy", "look": 1}],
        "props": [{"k": "torch", "x": 420, "y": 940}, {"k": "flutings", "x": 1150, "y": 260, "small": True, "draw": [0.3, 1.0], "seed": 13}],
        "tags": [{"text": "HELD UP?", "x": 1450, "y": 120, "word": "held", "size": 50, "color": "red"}]}),
    ("Picture a parent lifting a toddler up to the ceiling, so they can draw.", "walk", {
        "bg": "cave-night", "glow": True, "zoom": [1.08, 1.0],
        "actors": [{"who": "mom", "x": 1000, "y": 990, "s": 1.3, "pose": "hold", "carry": "toddler", "mood": "happy", "look": -1, "flip": True}],
        "props": [{"k": "torch", "x": 1500, "y": 940}, {"k": "flutings", "x": 760, "y": 300, "small": True, "draw": [0.1, 1.0], "seed": 17}]}),
    ("In Chauvet Cave, also in France, a child left something else behind.", "walk", {
        "bg": "cave-night",
        "tags": [{"text": "CHAUVET CAVE · FRANCE", "x": 960, "y": 980, "word": "Chauvet", "size": 50}],
        "props": [{"k": "ceiling", "reveal": [0.1, 0.6]}]}),
    ("Footprints, from 27,000 to 25,000 years ago, next to smoke stains from torches.", "reveal", {
        "bg": "cave-night", "glow": True,
        "props": [{"k": "footprints", "x": 260, "y": 940, "x1": 1500, "y1": 880, "n": 12, "onlyKid": True, "kid": [0, 1], "walk": [0.05, 0.6], "s": 2.0, "color": "#e8d8b8"},
                  {"k": "torch", "x": 1650, "y": 880, "word": "torches"}],
        "tags": [{"text": "27,000-25,000 YEARS AGO", "x": 960, "y": 170, "word": "27,000", "size": 48},
                 {"text": "TORCH SMOKE", "x": 1450, "y": 330, "word": "smoke", "size": 44, "color": "red"}]}),
    ("A kid, walking deep into a dark cave, by torchlight.", "cold", {
        "bg": "cave-night", "glow": True, "zoom": [1.0, 1.1], "focus": [1000, 800],
        "actors": [{"who": "kid", "x": 500, "y": 980, "s": 1.25, "pose": "walk", "mood": "wow", "look": 1, "to": [1150, 980], "move": [0.0, 1.0]}],
        "props": [{"k": "torch", "x": 620, "y": 900, "to": [1270, 900]}]}),
    ("Those may be the oldest human footprints that can be accurately dated.", "reveal", {
        "bg": "paper",
        "props": [{"k": "footprints", "x": 400, "y": 560, "x1": 1500, "y1": 520, "n": 8, "onlyKid": True, "kid": [0, 1], "s": 2.2}],
        "tags": [{"text": "OLDEST DATED FOOTPRINTS?", "x": 960, "y": 220, "word": "oldest", "size": 56, "color": "red"}]}),
    ("And yes, Stone Age kids had toys.", "walk", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 760, "y": 990, "s": 1.4, "pose": "wave", "mood": "happy", "look": 1}],
        "props": [{"k": "stoneballs", "x": 1300, "y": 900, "s": 1.2, "word": "toys"}]}),
    ("In China, in the grave of a four-year-old girl, archaeologists found three stone balls.", "reveal", {
        "bg": "paper", "zoom": [1.0, 1.1], "focus": [960, 620],
        "props": [{"k": "stoneballs", "x": 960, "y": 620, "s": 1.8, "word": "balls"}],
        "tags": [{"text": "CHINA", "x": 560, "y": 200, "word": "China", "size": 52},
                 {"text": "A 4-YEAR-OLD GIRL'S GRAVE", "x": 1250, "y": 300, "word": "girl", "size": 44}]}),
    ("They're one of the earliest known examples of children's toys.", "walk", {
        "bg": "paper",
        "props": [{"k": "stoneballs", "x": 960, "y": 640, "s": 1.6}],
        "big": {"text": "ONE OF THE FIRST TOYS", "at": 0.15, "y": 180, "size": 92}}),
    ("And the oldest known doll? About 4,000 years old.", "reveal", {
        "bg": "paper",
        "props": [{"k": "draw-doll", "x": 1100, "y": 600}],
        "actors": [{"who": "kid", "x": 640, "y": 990, "s": 1.3, "pose": "point", "mood": "wow", "look": 1}],
        "big": {"text": "~4,000 YEARS", "word": "4,000", "y": 160, "size": 110}}),

    # ---------------------------------------------------------------- part 4: loved
    ("But the most moving clue about Stone Age childhood comes from a burial.", "cold", {
        "bg": "night", "chapter": "PART 4 · LOVED",
        "props": [{"k": "candle", "x": 960, "y": 900, "s": 1.3}]}),
    ("At Sungir, over 30,000 years ago, two young adolescents were buried head to head.", "walk", {
        "bg": "paper",
        "props": [{"k": "draw-grave", "x": 960, "y": 620}],
        "tags": [{"text": "SUNGIR", "x": 560, "y": 200, "word": "Sungir", "size": 56},
                 {"text": "30,000+ YEARS AGO", "x": 1350, "y": 200, "word": "30,000", "size": 48},
                 {"text": "HEAD TO HEAD", "x": 960, "y": 930, "word": "head", "size": 46, "color": "red"}]}),
    ("They were covered in ivory beads. More than 13,000 of them.", "reveal", {
        "bg": "paper",
        "props": [{"k": "beads", "x": 960, "y": 820, "fill": [0.1, 0.9]}]}),
    ("Making that many beads would have taken about 10,000 hours of work. That's years.", "walk", {
        "bg": "village-night", "glow": True,
        "actors": [{"who": "elder", "x": 760, "y": 990, "s": 1.3, "pose": "write", "mood": "sleepy", "look": 1}],
        "props": [{"k": "fire", "x": 1100, "y": 990, "s": 0.8}, {"k": "clock", "x": 1500, "y": 420, "s": 0.9, "word": "hours"}],
        "big": {"text": "10,000 HOURS", "word": "10,000", "y": 150, "size": 100, "light": True}}),
    ("Whoever these children were, someone loved them very much.", "payoff", {
        "bg": "dusk", "zoom": [1.06, 1.0],
        "actors": [{"who": "mom", "x": 820, "y": 970, "s": 1.25, "pose": "hold", "carry": "toddler", "mood": "happy", "look": 1},
                   {"who": "dad", "x": 1120, "y": 970, "s": 1.25, "pose": "stand", "mood": "happy", "look": -1, "flip": True}]}),

    # ---------------------------------------------------------------- the twist
    ("And one more thing. Kids are still making discoveries.", "walk", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 960, "y": 990, "s": 1.5, "pose": "wave", "mood": "happy", "look": 0}]}),
    ("In 1879, an eight-year-old girl named María led her father into a cave in northern Spain.", "walk", {
        "bg": "cave-night", "glow": True, "zoom": [1.0, 1.06],
        "actors": [{"who": "maria", "x": 600, "y": 990, "s": 1.45, "pose": "point", "mood": "wow", "look": 1, "to": [900, 990], "move": [0.2, 0.8]},
                   {"who": "noble2", "x": 300, "y": 990, "s": 1.3, "pose": "walk", "mood": "neutral", "look": 1, "to": [560, 990], "move": [0.25, 0.85]}],
        "props": [{"k": "candle", "x": 1300, "y": 990}],
        "tags": [{"text": "1879", "x": 400, "y": 170, "word": "1879", "size": 60}, {"text": "MARÍA, AGE 8", "x": 1300, "y": 220, "word": "María", "size": 50, "color": "red"}]}),
    ("Her father realized the markings on the walls were drawings.", "reveal", {
        "bg": "cave-night", "glow": True,
        "actors": [{"who": "noble2", "x": 760, "y": 990, "s": 1.3, "pose": "point", "mood": "wow", "look": 1},
                   {"who": "maria", "x": 1000, "y": 990, "s": 1.45, "pose": "wave", "mood": "happy", "look": -1}],
        "props": [{"k": "ceiling", "reveal": [0.15, 0.8]}]}),
    ("That cave was Altamira, home to some of the most famous Stone Age paintings in the world.", "payoff", {
        "bg": "cave-night", "zoom": [1.0, 1.08], "focus": [960, 380],
        "props": [{"k": "ceiling"}],
        "big": {"text": "ALTAMIRA", "word": "Altamira", "y": 760, "size": 130, "light": True}}),
    ("Children made the art. And a child helped find it.", "payoff", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 700, "y": 990, "s": 1.3, "pose": "point", "mood": "happy", "look": 1},
                   {"who": "kid", "x": 1220, "y": 990, "s": 1.3, "pose": "wave", "mood": "happy", "look": -1, "flip": True, "line": 0, "at": 0.5}],
        "props": [{"k": "flutings", "x": 960, "y": 420, "small": True, "draw": [0.0, 0.6], "seed": 21}]}),
    ("So the next time a kid draws on a wall... maybe they're just doing what kids have always done.", "walk", {
        "bg": "room-night",
        "actors": [{"who": "modkid", "x": 900, "y": 990, "s": 1.8, "pose": "point", "mood": "happy", "look": 1}],
        "props": [{"k": "flutings", "x": 1300, "y": 600, "small": True, "draw": [0.0, 0.7], "seed": 25}]}),
    ("What would you have played with, as a Stone Age kid? Tell me in the comments.", "question", {
        "bg": "paper",
        "actors": [{"who": "kid", "x": 760, "y": 990, "s": 1.4, "pose": "think", "mood": "wow", "look": 1}],
        "props": [{"k": "stoneballs", "x": 1300, "y": 900}, {"k": "question", "x": 1300, "y": 420, "from": [880, 600], "at": 0.3}]}),
    ("Subscribe for more stories about the people who came before us.", "cta", {
        "bg": "dusk",
        "actors": [{"who": "dad", "x": 700, "y": 960, "s": 1.25, "pose": "wave", "mood": "happy"},
                   {"who": "mom", "x": 960, "y": 960, "s": 1.25, "pose": "hold", "carry": "toddler", "mood": "happy"},
                   {"who": "kid", "x": 1200, "y": 980, "s": 1.0, "pose": "wave", "mood": "happy"}],
        "props": [{"k": "subscribe", "x": 960, "y": 300, "at": 0.15}]}),
]

META = {
    "title": "What Was It Like to Be a Child 30,000 Years Ago?",
    "description": (
        "More than 20,000 years ago, someone carried a toddler across a muddy lakeshore in New Mexico - and their footprints "
        "are still there. So what was it really like to be a kid in the Stone Age?\n\n"
        "0:00 The footprints\n"
        "- White Sands footprints (21,000-23,000 years ago): a grown-up carried a very young child over a mile, set it down, "
        "slipped, and walked back alone; most prints there were made by teenagers and children\n"
        "- The Taung Child (2.58 million years ago, age 3-4) was probably killed by an eagle - talon marks in the eye sockets\n"
        "- The Nariokotome Boy (1.5-1.6 million years ago, age 7-11), the most complete Homo erectus skeleton ever found\n"
        "- Rouffignac Cave: many finger flutings were made by children as young as three, some perhaps held up to reach\n"
        "- Chauvet Cave: a child's footprints (27,000-25,000 years ago) beside torch smoke stains\n"
        "- Three stone balls in a four-year-old girl's grave at Banpo - among the earliest known toys\n"
        "- Sungir: two adolescents buried head-to-head with more than 13,000 beads (about 10,000 hours of work)\n"
        "- 1879: eight-year-old María led her father into the cave of Altamira\n\n"
        "What would you have played with as a Stone Age kid? Tell me in the comments.\n\n"
        "#history #prehistory #stoneage #archaeology"),
    "tags": ["stone age children", "prehistoric children", "what was it like to be a child in the stone age", "ancient humans",
             "white sands footprints", "taung child", "nariokotome boy", "cave art children", "altamira", "chauvet cave",
             "sungir", "human history", "animated history", "story time"],
    "thumb": ["STONE AGE", "KIDS?"],
}
