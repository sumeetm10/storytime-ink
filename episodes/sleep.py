"""Episode 1: What did ancient humans do when they couldn't sleep?

Lines 0-11 are the approved pilot opening (drawn by InkPilot.tsx); from line 12
every line has a shot (or continues the one before). Shot keys, read by
remotion/src/ink/Episode.tsx:
  bg       paper | night | dusk | savanna-night | cave-night | lab | lab-dark | room-night | town-night | village-night
  chapter  small part label, top left
  zoom     [from, to] camera scale over the shot; focus [x, y]
  actors   [{who, x, y, s, pose, mood, look, flip, lie, ghost, to:[x,y], move:[a,b], then:{at, mood, pose}, talk:[a,b]}]
  props    [{k, x, y, s, at, ...}]   (k: see Episode.tsx PROPS)
  tags     [{text, x, y, at, size, rot, color}]
  big      {text, sub, at, y, color}
Times ("at", "move", ...) are fractions of the shot; add "line": n to time an
element inside the n-th line of the shot instead.
"""

FACTS = {
    # opening (pilot)
    "Control of fire by early humans": ["protection from predators (especially at night)", "1.79 million years ago in Wonderwerk Cave"],
    "Sibudu Cave": ["an older example from 200,000 years ago was recently discovered at Border Cave",
                    "natural insecticidal and larvicidal chemicals", "bedding (77,000 years ago)"],
    "Border Cave": ["grass bedding"],
    "Segmented sleep": ["separated by about an hour of wakefulness", "wake around midnight",
                        "before the Industrial Revolution, interrupted sleep was dominant", "common in preindustrial societies"],
    # part 1
    "Swartkrans": ["between 1.9 and 2.1 million years old", "were themselves victims of predation by big cats", "Megantereon or leopards"],
    "Megantereon": ["saber-toothed cat"],
    "Campfire": ["built campfires roughly 1.6 million years ago"],
    # part 2
    "Thomas Wehr": ["dark for 14 hours each day for a month", "sleep as much as they wanted", "slept an average of 11 hours a night",
                    "sleep debt", "By the fourth week, the subjects slept an average of eight hours a night",
                    "in two separate blocks", "lie awake for one to two hours", "three to five hours of sleep",
                    "an hour or two in quiet wakefulness", "natural or pre-historic tendency for humans"],
    # part 3
    "Polyphasic sleep": ["pray and reflect, and to interpret dreams, which were more vivid at that hour",
                         "scholars and poets to write uninterrupted", "visited neighbors", "petty crime"],
    "Night": ["sanctuary from ordinary existence"],
    # part 4
    "Paleolithic flute": ["Hohle Fels cave in Germany", "vulture radius bone perforated with five finger holes",
                          "approximately 35,000 years ago", "earliest known musical instruments"],
    "Tally stick": ["baboon's fibula with 29 distinct notches, discovered within the Border Cave", "44,200 and 43,000 years old"],
    "Upper Paleolithic": ["possible tally stick or lunar calendar"],
    "Storytelling": ["one of the oldest and most universal means of transmitting information"],
    # part 5
    "Sleep": ["urban upper class in Europe in the late 17th century", "street lighting, domestic lighting and a surge in coffee houses",
              "spread over the next 200 years", "receded entirely from our social consciousness", "blue light"],
}

INTRO = {"lines": 12, "at": dict(dark=1, nothing=2, title=3, fire=4, gifts=5, old=6, grass=7, bugs=8, strange=9, shifts=10, cliff=11)}

N = "savanna-night"
LINES = [
    # ---------------------------------------------------------------- opening (InkPilot)
    ("Picture a night, long before electricity.", "hook", None),
    ("The sun goes down, and the world goes dark. Really dark.", "cold", None),
    ("No lamps. No phone. No roof. Just you, your family, and whatever is out there in the grass.", "walk", None),
    ("So what did ancient humans do when they couldn't sleep?", "question", None),
    ("Their first secret weapon was fire.", "reveal", None),
    ("Fire gave them warmth, light, and protection from predators, especially at night.", "walk", None),
    ("And it's old. Signs of humans using fire go back almost 1.8 million years.", "reveal", None),
    ("They didn't sleep on bare rock, either. In Border Cave, in South Africa, people made beds of grass 200,000 years ago.", "walk", None),
    ("In another cave, Sibudu, the beds were topped with leaves full of natural insect killers. "
     "A bug-proof mattress, 77,000 years ago.", "reveal", None),
    ("But here's the strange part. For centuries, people didn't even sleep the way we do.", "stop", None),
    ("Before the Industrial Revolution, many slept in two shifts. A first sleep. Then about an hour awake, "
     "around midnight. Then a second sleep.", "walk", None),
    ("So what were they doing, awake in the dark? That's where it gets interesting.", "payoff", None),

    # ---------------------------------------------------------------- part 1: the hunted
    ("But first, let's go back even further. Before fire. Before beds.", "walk", {
        "bg": N, "chapter": "PART 1 · THE HUNTED", "zoom": [1.0, 1.06],
        "actors": [{"who": "hominin", "x": 820, "y": 930, "s": 1.25, "pose": "sit", "mood": "scared", "look": -1},
                   {"who": "hominin2", "x": 1060, "y": 930, "s": 1.25, "pose": "sit", "mood": "worried", "flip": True, "look": 1}],
        "props": [{"k": "eyes", "x": 300, "y": 840, "at": 0.45}, {"k": "eyes", "x": 1640, "y": 820, "at": 0.6}]}),
    ("About two million years ago, in a South African cave called Swartkrans, our ancestors were not the hunters.", "walk", {
        "bg": "cave-night", "zoom": [1.0, 1.05],
        "actors": [{"who": "hominin", "x": 700, "y": 940, "s": 1.3, "pose": "sit", "mood": "worried", "look": 1},
                   {"who": "hominin2", "x": 950, "y": 940, "s": 1.3, "pose": "stand", "mood": "worried", "look": 1}],
        "tags": [{"text": "SWARTKRANS · SOUTH AFRICA", "x": 760, "y": 150, "at": 0.3},
                 {"text": "ABOUT 2 MILLION YEARS AGO", "x": 760, "y": 255, "at": 0.55, "size": 38, "rot": 3}]}),
    ("They were the hunted.", "stop", {
        "bg": N, "zoom": [1.0, 1.08], "focus": [700, 800],
        "actors": [{"who": "hominin", "x": 420, "y": 940, "s": 1.25, "pose": "scared", "mood": "scared", "look": 1},
                   {"who": "hominin2", "x": 600, "y": 940, "s": 1.25, "pose": "scared", "mood": "scared", "look": 1}],
        "props": [{"k": "cat", "x": 2100, "y": 960, "to": [1350, 960], "move": [0.0, 0.8], "s": 1.3}],
        "tags": [{"text": "THE HUNTED", "x": 960, "y": 200, "at": 0.25, "size": 64, "color": "red"}]}),
    ("Many early human fossils found there were left by big cats. Leopards, or a saber-toothed cat called Megantereon.", "reveal", {
        "bg": "paper",
        "props": [{"k": "bones", "x": 960, "y": 950, "at": 0.05},
                  {"k": "cat", "x": 560, "y": 760, "s": 1.05, "at": 0.42, "still": True},
                  {"k": "cat", "x": 1380, "y": 760, "s": 1.05, "at": 0.62, "still": True, "sabre": True}],
        "tags": [{"text": "BIG CATS", "x": 960, "y": 170, "at": 0.15, "size": 60, "color": "red"},
                 {"text": "LEOPARD", "x": 560, "y": 860, "at": 0.45},
                 {"text": "MEGANTEREON", "x": 1380, "y": 860, "at": 0.68},
                 {"text": "saber-toothed", "x": 1380, "y": 950, "at": 0.75, "size": 32, "rot": 2}]}),
    ("For our ancestors, the dark was when the big cats came.", "cold", {
        "bg": "night", "zoom": [1.0, 1.15], "focus": [960, 540],
        "props": [{"k": "cateyes", "x": 960, "y": 520, "at": 0.25}]}),
    ("And then, in that very same cave, something changed.", "stop", {
        "bg": "cave-night", "zoom": [1.05, 1.0],
        "actors": [{"who": "hominin", "x": 980, "y": 950, "s": 1.3, "pose": "feed", "mood": "neutral", "look": -1},
                   {"who": "hominin2", "x": 1260, "y": 950, "s": 1.3, "pose": "stand", "mood": "worried", "flip": True, "look": 1}],
        "props": [{"k": "fire", "x": 740, "y": 940, "s": 1.0, "grow": [0.75, 1.0], "max": 0.25}]}),
    ("Burned bones show that someone lit campfires at Swartkrans, about 1.6 million years ago.", "reveal", {
        "bg": "cave-night", "glow": True,
        "actors": [{"who": "hominin", "x": 980, "y": 950, "s": 1.3, "pose": "sit", "mood": "wow", "look": -1, "then": {"at": 0.5, "mood": "happy"}},
                   {"who": "hominin2", "x": 1260, "y": 950, "s": 1.3, "pose": "stand", "mood": "wow", "flip": True, "look": 1,
                    "then": {"at": 0.5, "mood": "happy", "pose": "wave"}}],
        "props": [{"k": "fire", "x": 740, "y": 940, "s": 1.1, "grow": [0.0, 0.3], "min": 0.25},
                  {"k": "bones", "x": 520, "y": 960, "s": 0.6, "at": 0.35, "burnt": True}],
        "tags": [{"text": "1.6 MILLION YEARS AGO", "x": 960, "y": 180, "at": 0.55, "size": 52}]}),
    ("The hunted had found a way to push back the dark.", "payoff", {
        "bg": N, "glow": True, "zoom": [1.08, 1.0],
        "actors": [{"who": "hominin", "x": 700, "y": 950, "s": 1.25, "pose": "sit", "mood": "happy", "look": 1},
                   {"who": "hominin2", "x": 1220, "y": 950, "s": 1.25, "pose": "sit", "mood": "happy", "flip": True, "look": 1}],
        "props": [{"k": "fire", "x": 960, "y": 940, "s": 1.2},
                  {"k": "cat", "x": 1650, "y": 900, "to": [2200, 900], "move": [0.2, 0.9], "s": 0.9, "flip": True},
                  {"k": "eyes", "x": 220, "y": 820, "fade": [0.0, 0.6]}]}),

    # ---------------------------------------------------------------- part 2: the experiment
    ("Now, back to that strange way of sleeping.", "walk", {
        "bg": "paper", "chapter": "PART 2 · THE EXPERIMENT",
        "props": [{"k": "sleepbar", "x": 960, "y": 470, "blocks": [["sleep", 0.46], ["awake", 0.08], ["sleep", 0.46]], "grow": [0.1, 0.8]},
                  {"k": "mound", "x": 960, "y": 960, "s": 1.3}],
        "actors": [{"who": "mom", "x": 960, "y": 930, "s": 1.0, "lie": True, "mood": "sleepy"}]}),
    ("In the 1990s, a scientist named Thomas Wehr tried something simple.", "walk", {
        "bg": "lab",
        "actors": [{"who": "scientist", "x": 760, "y": 960, "s": 1.35, "pose": "point", "mood": "happy", "look": 1}],
        "props": [{"k": "clipboard", "x": 1300, "y": 640, "at": 0.3}],
        "tags": [{"text": "THOMAS WEHR · 1990s", "x": 960, "y": 170, "at": 0.45, "size": 50}]}),
    ("He put volunteers in a place where it was dark for 14 hours every day, for a month.", "reveal", {
        "bg": "lab-dark", "dark": [0.1, 0.35],
        "actors": [{"who": "volunteer", "x": 960, "y": 960, "s": 1.3, "pose": "stand", "mood": "worried", "look": 0}],
        "props": [{"k": "clock", "x": 520, "y": 460, "dark": 14, "at": 0.3}, {"k": "calendar", "x": 1400, "y": 460, "text": "1 MONTH", "at": 0.7}],
        "tags": [{"text": "14 HOURS OF DARK", "x": 520, "y": 790, "at": 0.4, "size": 40, "color": "red"}]}),
    ("They could sleep as much as they wanted.", "walk", {
        "bg": "room-night",
        "actors": [{"who": "volunteer", "x": 960, "y": 900, "s": 1.15, "lie": True, "mood": "happy"}],
        "props": [{"k": "bed", "x": 960, "y": 930}, {"k": "zzz", "x": 820, "y": 760, "at": 0.3}],
        "big": {"text": "11 HOURS", "line": 1, "at": 0.15, "y": 150, "light": True},
        "tags": [{"text": "SLEEP DEBT", "x": 1400, "y": 420, "line": 1, "at": 0.65, "color": "red", "rot": 4}]}),
    ("On the first night, they slept for 11 hours. They were paying back their sleep debt.", "reveal", None),
    ("But by the fourth week, something odd happened.", "stop", {
        "bg": "room-night",
        "actors": [{"who": "volunteer", "x": 960, "y": 900, "s": 1.15, "lie": True, "mood": "sleepy", "then": {"at": 0.75, "mood": "wow"}}],
        "props": [{"k": "bed", "x": 960, "y": 930}, {"k": "calendar", "x": 1500, "y": 380, "flip": ["WEEK 1", "WEEK 2", "WEEK 3", "WEEK 4"], "at": 0.0}]}),
    ("They still slept about eight hours, but in two separate blocks.", "reveal", {
        "bg": "paper",
        "props": [{"k": "sleepbar", "x": 960, "y": 560, "blocks": [["awake", 0.12], ["sleep", 0.32], ["awake", 0.12], ["sleep", 0.32], ["none", 0.12]],
                   "grow": [0.15, 0.9], "labels": True}],
        "big": {"text": "8 HOURS · 2 BLOCKS", "at": 0.3, "y": 170}}),
    ("First they lay awake for an hour or two. Then three to five hours of sleep. Then an hour or two of quiet wakefulness. "
     "Then a second sleep.", "walk", {
        "bg": "paper",
        "props": [{"k": "sleepbar", "x": 960, "y": 560, "blocks": [["awake", 0.12], ["sleep", 0.32], ["awake", 0.12], ["sleep", 0.32], ["none", 0.12]],
                   "grow": [0.05, 0.95], "labels": True, "steps": [0.05, 0.25, 0.5, 0.78, 0.95]}],
        "actors": [{"who": "volunteer", "x": 960, "y": 1000, "s": 0.85, "lie": True, "mood": "sleepy"}]}),
    ("With long dark nights and no lamps, their bodies slipped into an older pattern.", "walk", {
        "bg": "cave-night", "glow": True, "zoom": [1.0, 1.06],
        "actors": [{"who": "dad", "x": 760, "y": 930, "s": 0.95, "lie": True, "mood": "sleepy"},
                   {"who": "mom", "x": 1160, "y": 930, "s": 0.95, "lie": True, "mood": "sleepy"}],
        "props": [{"k": "mound", "x": 760, "y": 960, "s": 1.0}, {"k": "mound", "x": 1160, "y": 960, "s": 1.0},
                  {"k": "fire", "x": 400, "y": 950, "s": 0.6}, {"k": "zzz", "x": 700, "y": 780}, {"k": "zzz", "x": 1100, "y": 780}],
        "tags": [{"text": "NATURAL?", "x": 760, "y": 200, "line": 1, "at": 0.3, "size": 52, "rot": -3},
                 {"text": "PREHISTORIC?", "x": 1240, "y": 260, "line": 1, "at": 0.55, "size": 52, "rot": 3}]}),
    ("Wehr suggested this two-part sleep might be the natural, prehistoric way humans sleep.", "reveal", None),
    ("Not everyone agrees. But it matches what historians found in old records.", "walk", {
        "bg": "paper",
        "props": [{"k": "book", "x": 960, "y": 620, "s": 1.3, "at": 0.4}],
        "tags": [{"text": "NOT EVERYONE AGREES", "x": 960, "y": 200, "at": 0.05, "size": 48, "color": "red"},
                 {"text": "OLD RECORDS", "x": 960, "y": 900, "at": 0.6}]}),

    # ---------------------------------------------------------------- part 3: the hour in the dark
    ("So what do you do with an hour awake, in the middle of the night?", "question", {
        "bg": "village-night", "chapter": "PART 3 · THE HOUR IN THE DARK",
        "actors": [{"who": "mom", "x": 960, "y": 960, "s": 1.3, "pose": "sit", "mood": "neutral", "look": 1}],
        "props": [{"k": "mound", "x": 1040, "y": 980, "s": 1.2}, {"k": "question", "x": 1340, "y": 420, "from": [1030, 560], "at": 0.4}]}),
    ("For people before the Industrial Revolution, we actually know.", "reveal", {
        "bg": "paper",
        "props": [{"k": "book", "x": 960, "y": 600, "s": 1.5, "at": 0.15}],
        "tags": [{"text": "BEFORE THE INDUSTRIAL REVOLUTION", "x": 960, "y": 180, "at": 0.1, "size": 46}]}),
    ("Historian Roger Ekirch found that many used it to pray, and to think.", "walk", {
        "bg": "village-night", "glow": True,
        "actors": [{"who": "elder", "x": 900, "y": 960, "s": 1.35, "pose": "pray", "mood": "sleepy"}],
        "props": [{"k": "candle", "x": 1180, "y": 960, "at": 0.0}, {"k": "think", "x": 1240, "y": 430, "from": [960, 560], "at": 0.6}],
        "tags": [{"text": "ROGER EKIRCH · HISTORIAN", "x": 960, "y": 160, "at": 0.1, "size": 44}]}),
    ("Others talked about their dreams, which felt more vivid at that hour.", "walk", {
        "bg": "village-night", "glow": True,
        "actors": [{"who": "dad", "x": 760, "y": 960, "s": 1.3, "pose": "sit", "mood": "happy", "look": 1, "talk": [0.0, 0.5]},
                   {"who": "mom", "x": 1180, "y": 960, "s": 1.3, "pose": "sit", "mood": "wow", "flip": True, "look": 1, "talk": [0.5, 0.95]}],
        "props": [{"k": "dream", "x": 960, "y": 360, "from": [800, 560], "at": 0.25}, {"k": "candle", "x": 960, "y": 980}]}),
    ("Scholars and poets wrote in the quiet. Some people visited their neighbours.", "walk", {
        "bg": "village-night",
        "actors": [{"who": "scholar", "x": 470, "y": 960, "s": 1.2, "pose": "write", "mood": "neutral", "look": 1},
                   {"who": "dad", "x": 1260, "y": 960, "s": 1.2, "pose": "wave", "mood": "happy", "look": 1, "at": 0.5},
                   {"who": "mom", "x": 1560, "y": 960, "s": 1.2, "pose": "stand", "mood": "wow", "flip": True, "look": 1, "at": 0.6}],
        "props": [{"k": "desk", "x": 560, "y": 960, "s": 1.0}, {"k": "candle", "x": 640, "y": 830, "s": 0.8},
                  {"k": "hut", "x": 1600, "y": 960, "s": 1.0, "at": 0.45}]}),
    ("And some... committed petty crimes.", "payoff", {
        "bg": "town-night",
        "actors": [{"who": "thief", "x": 260, "y": 960, "s": 1.25, "pose": "sneak", "mood": "happy", "look": 1, "to": [1500, 960], "move": [0.1, 1.0]}],
        "tags": [{"text": "PETTY CRIME", "x": 960, "y": 200, "at": 0.45, "size": 60, "color": "red", "rot": -6}]}),
    ("Ekirch called the old night a sanctuary from ordinary existence.", "reveal", {
        "bg": "village-night", "zoom": [1.0, 1.05],
        "big": {"text": "“A SANCTUARY FROM ORDINARY EXISTENCE”", "sub": "historian A. Roger Ekirch", "at": 0.25, "y": 170, "light": True}}),
    ("But what about people 40,000 years ago, long before writing? We have clues.", "question", {
        "bg": "paper",
        "props": [{"k": "magnifier", "x": 960, "y": 560, "at": 0.0},
                  {"k": "clue", "x": 560, "y": 820, "at": 0.7, "text": "1"}, {"k": "clue", "x": 960, "y": 820, "at": 0.78, "text": "2"},
                  {"k": "clue", "x": 1360, "y": 820, "at": 0.86, "text": "3"}],
        "big": {"text": "40,000 YEARS AGO?", "at": 0.15, "y": 170}}),

    # ---------------------------------------------------------------- part 4: the clues
    ("Clue number one: music.", "stop", {
        "bg": "paper", "chapter": "PART 4 · THE CLUES",
        "props": [{"k": "flute", "x": 960, "y": 640, "s": 1.0, "at": 0.3}],
        "big": {"text": "CLUE 1: MUSIC", "at": 0.0, "y": 260, "size": 110}}),
    ("In a German cave called Hohle Fels, archaeologists found a flute made from a vulture bone.", "walk", {
        "bg": "paper",
        "props": [{"k": "flute", "x": 960, "y": 560, "s": 1.6, "at": 0.35}],
        "tags": [{"text": "HOHLE FELS CAVE · GERMANY", "x": 960, "y": 170, "at": 0.15, "size": 46},
                 {"text": "VULTURE BONE", "x": 960, "y": 780, "at": 0.75, "rot": 2}]}),
    ("It has five finger holes, and it's about 35,000 years old.", "reveal", {
        "bg": "paper",
        "props": [{"k": "flute", "x": 960, "y": 560, "s": 1.6, "holes": [0.05, 0.45]}],
        "tags": [{"text": "5 FINGER HOLES", "x": 960, "y": 780, "at": 0.25, "rot": -2},
                 {"text": "~35,000 YEARS OLD", "x": 960, "y": 900, "at": 0.6, "size": 52, "color": "red", "rot": 3}]}),
    ("Flutes like it are the oldest musical instruments we know of.", "walk", {
        "bg": "cave-night", "glow": True,
        "actors": [{"who": "dad", "x": 900, "y": 950, "s": 1.3, "pose": "play", "mood": "sleepy", "look": 1}],
        "props": [{"k": "fire", "x": 560, "y": 950, "s": 0.8}, {"k": "notes", "x": 1080, "y": 560, "at": 0.15}],
        "tags": [{"text": "OLDEST KNOWN INSTRUMENTS", "x": 1280, "y": 200, "at": 0.45, "size": 44}]}),
    ("Clue number two: counting.", "stop", {
        "bg": "paper",
        "props": [{"k": "notchbone", "x": 960, "y": 640, "s": 1.0, "at": 0.3, "carve": [0.3, 0.9]}],
        "big": {"text": "CLUE 2: COUNTING", "at": 0.0, "y": 260, "size": 110}}),
    ("In Border Cave, the same cave with the grass beds, someone carved 29 notches into a baboon bone.", "walk", {
        "bg": "paper",
        "props": [{"k": "notchbone", "x": 960, "y": 600, "s": 1.6, "carve": [0.35, 0.95], "count": True}],
        "tags": [{"text": "BORDER CAVE", "x": 960, "y": 170, "at": 0.05, "size": 50},
                 {"text": "BABOON BONE", "x": 960, "y": 830, "at": 0.85, "rot": -2}]}),
    ("It's more than 40,000 years old.", "reveal", {
        "bg": "paper",
        "props": [{"k": "notchbone", "x": 960, "y": 600, "s": 1.6, "carve": [-1, 0], "count": True}],
        "tags": [{"text": "40,000+ YEARS OLD", "x": 960, "y": 860, "at": 0.2, "size": 56, "color": "red", "rot": 3}]}),
    ("Some think it was a tally stick, or even a calendar for counting the Moon.", "walk", {
        "bg": "paper",
        "props": [{"k": "notchbone", "x": 960, "y": 700, "s": 1.6, "carve": [-1, 0], "count": True},
                  {"k": "moonrow", "x": 960, "y": 380, "at": 0.45}],
        "tags": [{"text": "TALLY STICK?", "x": 600, "y": 180, "at": 0.15, "rot": -3}, {"text": "MOON CALENDAR?", "x": 1320, "y": 180, "at": 0.55, "rot": 3}]}),
    ("And when better to watch the Moon than an hour awake at night?", "question", {
        "bg": N, "zoom": [1.0, 1.06],
        "actors": [{"who": "mom", "x": 820, "y": 950, "s": 1.3, "pose": "sit", "mood": "happy", "look": 1}],
        "props": [{"k": "rock", "x": 820, "y": 960, "s": 1.0}, {"k": "moon", "x": 1450, "y": 300, "s": 1.6}]}),
    ("Clue number three: the fire itself.", "stop", {
        "bg": "paper",
        "props": [{"k": "fire", "x": 960, "y": 820, "s": 1.0}],
        "big": {"text": "CLUE 3: THE FIRE", "at": 0.0, "y": 260, "size": 110}}),
    ("A fire can't look after itself. Someone had to wake up and feed it.", "walk", {
        "bg": N, "glow": True,
        "actors": [{"who": "dad", "x": 700, "y": 950, "s": 1.3, "pose": "feed", "mood": "sleepy", "look": 1, "then": {"at": 0.7, "mood": "happy"}},
                   {"who": "mom", "x": 1380, "y": 955, "s": 0.95, "lie": True, "mood": "sleepy"}],
        "props": [{"k": "fire", "x": 960, "y": 950, "s": 1.1, "grow": [0.45, 0.85], "min": 0.3},
                  {"k": "mound", "x": 1380, "y": 980, "s": 1.1}, {"k": "zzz", "x": 1300, "y": 800}]}),
    ("And around a fire in the dark, with nothing else to do, people talk.", "walk", {
        "bg": N, "glow": True,
        "actors": [{"who": "dad", "x": 620, "y": 950, "s": 1.2, "pose": "sit", "mood": "happy", "look": 1, "talk": [0.3, 0.6]},
                   {"who": "mom", "x": 1300, "y": 950, "s": 1.2, "pose": "sit", "mood": "happy", "flip": True, "look": 1, "talk": [0.6, 0.95]},
                   {"who": "kid", "x": 1080, "y": 990, "s": 1.0, "pose": "sit", "mood": "wow", "look": -1}],
        "props": [{"k": "fire", "x": 900, "y": 960, "s": 1.0},
                  {"k": "speech", "x": 500, "y": 330, "from": [620, 600], "icon": "cat", "line": 2, "at": 0.0},
                  {"k": "speech", "x": 960, "y": 260, "from": [900, 600], "icon": "spear", "line": 2, "at": 0.25},
                  {"k": "speech", "x": 1420, "y": 330, "from": [1300, 600], "icon": "faces", "line": 2, "at": 0.5}],
        "tags": [{"text": "STORIES", "x": 960, "y": 105, "line": 1, "at": 0.1, "size": 64, "color": "red"}]}),
    ("Stories are one of the oldest ways humans pass on what they know.", "reveal", None),
    ("Warnings. Hunting tips. Who to trust. All shared in the firelight.", "walk", None),

    # ---------------------------------------------------------------- part 5: how we lost it
    ("So why don't we sleep like that anymore?", "question", {
        "bg": "paper", "chapter": "PART 5 · HOW WE LOST IT",
        "props": [{"k": "sleepbar", "x": 960, "y": 520, "blocks": [["sleep", 0.46], ["awake", 0.08], ["sleep", 0.46]], "grow": [-1, 0]},
                  {"k": "question", "x": 960, "y": 820, "from": [960, 600], "at": 0.4}]}),
    ("Ekirch thinks it began in Europe in the late 1600s, among wealthy city people.", "walk", {
        "bg": "town-night",
        "actors": [{"who": "noble", "x": -150, "y": 960, "s": 1.25, "pose": "walk", "mood": "happy", "look": 1, "to": [800, 960], "move": [0.0, 0.7]},
                   {"who": "noble2", "x": -350, "y": 960, "s": 1.25, "pose": "walk", "mood": "happy", "look": 1, "to": [1060, 960], "move": [0.05, 0.75]}],
        "tags": [{"text": "EUROPE · LATE 1600s", "x": 960, "y": 170, "at": 0.25, "size": 50}]}),
    ("Street lights, home lighting, and a boom in coffee houses made the night a time to be busy.", "reveal", {
        "bg": "town-night", "lights": [0.05, 0.35],
        "actors": [{"who": "noble", "x": 760, "y": 960, "s": 1.2, "pose": "drink", "mood": "happy", "look": 1, "at": 0.5},
                   {"who": "noble2", "x": 1080, "y": 960, "s": 1.2, "pose": "drink", "mood": "happy", "flip": True, "look": 1, "at": 0.55}],
        "props": [{"k": "streetlamp", "x": 300, "y": 960, "light": 0.05}, {"k": "streetlamp", "x": 1640, "y": 960, "light": 0.12}],
        "tags": [{"text": "STREET LIGHTS", "x": 420, "y": 200, "at": 0.08, "rot": -3}, {"text": "HOME LIGHTING", "x": 960, "y": 140, "at": 0.25},
                 {"text": "COFFEE HOUSES", "x": 1500, "y": 200, "at": 0.5, "rot": 3}]}),
    ("Over the next 200 years, the change spread.", "walk", {
        "bg": "town-night", "lights": [-1, 0], "spread": [0.0, 0.9], "zoom": [1.12, 1.0],
        "tags": [{"text": "+200 YEARS", "x": 960, "y": 180, "at": 0.3, "size": 54}]}),
    ("And by the 1920s, the idea of a first and second sleep had faded from memory.", "stop", {
        "bg": "paper",
        "props": [{"k": "sleepbar", "x": 960, "y": 540, "blocks": [["sleep", 0.46], ["awake", 0.08], ["sleep", 0.46]], "grow": [-1, 0], "fade": [0.45, 0.95]}],
        "big": {"text": "1920s", "at": 0.1, "y": 220, "size": 120}}),
    ("Today, electric lights and glowing screens keep us up late.", "walk", {
        "bg": "room-night",
        "actors": [{"who": "modern", "x": 960, "y": 900, "s": 1.15, "lie": True, "mood": "neutral", "phone": True}],
        "props": [{"k": "bed", "x": 960, "y": 930}],
        "tags": [{"text": "BLUE LIGHT", "x": 1400, "y": 300, "at": 0.55, "color": "blue", "rot": 3}]}),
    ("So we squeeze all our sleep into one solid block.", "walk", {
        "bg": "paper",
        "props": [{"k": "sleepbar", "x": 960, "y": 540, "blocks": [["sleep", 0.46], ["awake", 0.08], ["sleep", 0.46]], "grow": [-1, 0], "squeeze": [0.2, 0.8]}],
        "tags": [{"text": "ONE SOLID BLOCK", "x": 960, "y": 780, "at": 0.75, "size": 50}]}),

    # ---------------------------------------------------------------- ending
    ("So if you ever wake up at three in the morning, and can't fall back asleep...", "walk", {
        "bg": "room-night",
        "actors": [{"who": "modern", "x": 960, "y": 960, "s": 1.15, "pose": "sitbed", "mood": "worried", "look": 1}],
        "props": [{"k": "bed", "x": 960, "y": 930}, {"k": "clock", "x": 1450, "y": 420, "time": 3, "at": 0.25}]}),
    ("remember: for centuries, that hour awake was perfectly normal.", "reveal", {
        "bg": "room-night",
        "actors": [{"who": "modern", "x": 960, "y": 960, "s": 1.15, "pose": "sitbed", "mood": "happy", "look": -1},
                   {"who": "mom", "x": 520, "y": 960, "s": 1.15, "pose": "sit", "mood": "happy", "look": 1, "ghost": True, "at": 0.3}],
        "props": [{"k": "bed", "x": 960, "y": 930}, {"k": "fire", "x": 330, "y": 960, "s": 0.55, "ghost": True, "at": 0.3}]}),
    ("Our ancestors used it to tend the fire, watch the Moon, make music, and dream.", "payoff", {
        "bg": N, "glow": True, "zoom": [1.06, 1.0],
        "actors": [{"who": "dad", "x": 560, "y": 950, "s": 1.1, "pose": "feed", "mood": "happy", "look": 1},
                   {"who": "mom", "x": 1140, "y": 950, "s": 1.1, "pose": "sit", "mood": "happy", "look": 1, "at": 0.25},
                   {"who": "kid", "x": 1420, "y": 980, "s": 0.95, "pose": "play", "mood": "sleepy", "flip": True, "at": 0.5}],
        "props": [{"k": "fire", "x": 800, "y": 950, "s": 0.9}, {"k": "moon", "x": 1500, "y": 260, "s": 1.2, "at": 0.25},
                  {"k": "notes", "x": 1340, "y": 640, "at": 0.55}, {"k": "dream", "x": 640, "y": 360, "from": [560, 560], "at": 0.8}]}),
    ("Subscribe for more stories about the people who came before us.", "cta", {
        "bg": "dusk",
        "actors": [{"who": "dad", "x": 700, "y": 960, "s": 1.25, "pose": "wave", "mood": "happy"},
                   {"who": "mom", "x": 960, "y": 960, "s": 1.25, "pose": "wave", "mood": "happy"},
                   {"who": "kid", "x": 1200, "y": 980, "s": 1.0, "pose": "wave", "mood": "happy"}],
        "props": [{"k": "subscribe", "x": 960, "y": 300, "at": 0.15}]}),
]

META = {
    "title": "What Did Ancient Humans Do When They Couldn't Sleep?",
    "description": (
        "Long before electricity, the night was long, dark and dangerous. So what did our ancestors do when they "
        "couldn't sleep?\n\n"
        "- Fire gave warmth, light and protection from predators - the oldest signs of human fire use are about "
        "1.8 million years old (Wonderwerk Cave)\n"
        "- Grass beds 200,000 years ago at Border Cave; insect-repelling leaf bedding 77,000 years ago at Sibudu\n"
        "- At Swartkrans, our ancestors were hunted by big cats - then lit campfires there ~1.6 million years ago\n"
        "- Thomas Wehr's experiment: 14 hours of darkness a day split people's sleep into two blocks\n"
        "- Before the Industrial Revolution many slept in two shifts, and used the hour awake to pray, talk about "
        "dreams, write, visit neighbours... or commit petty crimes (historian A. Roger Ekirch)\n"
        "- Clues from 40,000 years ago: a vulture-bone flute (Hohle Fels) and the 29-notch Lebombo bone\n"
        "- Street lights, home lighting and coffee houses ended the 'first and second sleep' by the 1920s\n\n"
        "Have you ever woken up at 3 a.m.? Tell me in the comments.\n\n#history #humanhistory #sleep #prehistory"),
    "tags": ["ancient humans", "what did ancient humans do at night", "segmented sleep", "first sleep second sleep",
             "prehistoric humans", "human history", "history of sleep", "biphasic sleep", "stone age", "early humans",
             "animated history", "story time"],
}
