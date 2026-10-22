// Curated quiz questions: 10 per place, all hand-written and place-specific.
// No question text is repeated anywhere, and no two questions in the same
// quiz share a correct answer. Generated from a reviewed source list; answer
// positions are shuffled deterministically so they stay stable between builds.
//
// Shape: { [placeId]: [{ question, options: [4 strings], answerIndex }] }
export const QUIZ_BANK = {
 "colosseum": [
  {
   "question": "Which emperor began construction of the Colosseum around 72 CE?",
   "options": [
    "Trajan",
    "Hadrian",
    "Vespasian",
    "Augustus"
   ],
   "answerIndex": 2
  },
  {
   "question": "The Colosseum's original name, the Flavian Amphitheatre, honours which dynasty?",
   "options": [
    "The Flavians",
    "The Antonines",
    "The Severans",
    "The Julio-Claudians"
   ],
   "answerIndex": 0
  },
  {
   "question": "Who opened the Colosseum in 80 CE with a hundred days of games?",
   "options": [
    "Claudius",
    "Caligula",
    "Titus",
    "Nero"
   ],
   "answerIndex": 2
  },
  {
   "question": "Roughly how many spectators is the Colosseum estimated to have held?",
   "options": [
    "15,000 to 20,000",
    "50,000 to 80,000",
    "5,000 to 8,000",
    "150,000 to 200,000"
   ],
   "answerIndex": 1
  },
  {
   "question": "Whose giant statue nearby is often cited as the source of the name 'Colosseum'?",
   "options": [
    "Marcus Aurelius",
    "Julius Caesar",
    "Constantine",
    "Nero"
   ],
   "answerIndex": 3
  },
  {
   "question": "What lay on the site before the Colosseum was built?",
   "options": [
    "An artificial lake in Nero's palace grounds",
    "A gladiator barracks",
    "A temple of Jupiter",
    "The Forum's main marketplace"
   ],
   "answerIndex": 0
  },
  {
   "question": "What is the network of tunnels and chambers beneath the arena floor called?",
   "options": [
    "The cloaca",
    "The catacomb",
    "The atrium",
    "The hypogeum"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which stone was used for much of the Colosseum's outer facade?",
   "options": [
    "Travertine",
    "Carrara marble",
    "Red brick",
    "Granite"
   ],
   "answerIndex": 0
  },
  {
   "question": "Construction was largely funded by spoils from the suppression of which revolt?",
   "options": [
    "The slave revolt of Spartacus",
    "The Batavian revolt on the Rhine",
    "Boudica's revolt in Britain",
    "The Jewish revolt in Judaea"
   ],
   "answerIndex": 3
  },
  {
   "question": "What natural event in 1349 brought down part of the Colosseum's southern side?",
   "options": [
    "A volcanic eruption",
    "An earthquake",
    "A lightning fire",
    "A flood of the Tiber"
   ],
   "answerIndex": 1
  }
 ],
 "rome": [
  {
   "question": "According to legend, who founded Rome in 753 BCE?",
   "options": [
    "Tarquin the Proud",
    "Numa Pompilius",
    "Romulus",
    "Aeneas"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which animal is said to have nursed the twins Romulus and Remus?",
   "options": [
    "A goat",
    "A lioness",
    "A bear",
    "A she-wolf"
   ],
   "answerIndex": 3
  },
  {
   "question": "By tradition, in which year did the Roman Republic replace the monarchy?",
   "options": [
    "264 BCE",
    "509 BCE",
    "753 BCE",
    "146 BCE"
   ],
   "answerIndex": 1
  },
  {
   "question": "Who became Rome's first emperor after the Republic collapsed?",
   "options": [
    "Julius Caesar",
    "Augustus",
    "Nero",
    "Tiberius"
   ],
   "answerIndex": 1
  },
  {
   "question": "On what date was Julius Caesar assassinated?",
   "options": [
    "15 September 31 BCE",
    "1 January 44 BCE",
    "15 March 44 BCE",
    "15 March 49 BCE"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who was the last king of Rome, expelled around 509 BCE?",
   "options": [
    "Tarquin the Proud",
    "Numa Pompilius",
    "Servius Tullius",
    "Ancus Marcius"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which famous road, called the 'queen of roads', ran south-east from Rome?",
   "options": [
    "The Via Aurelia",
    "The Silk Road",
    "The Appian Way",
    "The Via Egnatia"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Germanic general deposed the last western emperor in 476 CE?",
   "options": [
    "Odoacer",
    "Attila",
    "Theodoric",
    "Alaric"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did the Romans call the Mediterranean Sea?",
   "options": [
    "Mare Nostrum",
    "Pontus Euxinus",
    "Mare Clausum",
    "Oceanus"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which hill is traditionally said to be where Romulus founded the city?",
   "options": [
    "The Janiculum",
    "The Aventine",
    "The Esquiline",
    "The Palatine"
   ],
   "answerIndex": 3
  }
 ],
 "athens": [
  {
   "question": "Which 490 BCE battle saw Athens repel the first Persian invasion?",
   "options": [
    "Thermopylae",
    "Marathon",
    "Plataea",
    "Mycale"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which statesman guided Athens through its golden age and the building of the Parthenon?",
   "options": [
    "Themistocles",
    "Alcibiades",
    "Solon",
    "Pericles"
   ],
   "answerIndex": 3
  },
  {
   "question": "The Parthenon was dedicated to which goddess?",
   "options": [
    "Artemis",
    "Hera",
    "Athena",
    "Demeter"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which reformer is credited with founding Athenian democracy around 508 BCE?",
   "options": [
    "Cimon",
    "Draco",
    "Cleisthenes",
    "Peisistratus"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which 480 BCE naval battle destroyed much of the Persian fleet?",
   "options": [
    "Lade",
    "Aegospotami",
    "Actium",
    "Salamis"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Athenian philosopher was sentenced to death by drinking hemlock in 399 BCE?",
   "options": [
    "Plato",
    "Epicurus",
    "Aristotle",
    "Socrates"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which alliance of city-states did Athens lead from 478 BCE?",
   "options": [
    "The Peloponnesian League",
    "The Corinthian League",
    "The Delian League",
    "The Aetolian League"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which historian wrote the classic account of the Peloponnesian War?",
   "options": [
    "Herodotus",
    "Xenophon",
    "Plutarch",
    "Thucydides"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which tragedian wrote Oedipus the King and Antigone for Athenian festivals?",
   "options": [
    "Euripides",
    "Aeschylus",
    "Aristophanes",
    "Sophocles"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the name of the Athenian assembly where citizens voted directly?",
   "options": [
    "The Curia",
    "The Gerousia",
    "The Senate",
    "The Ecclesia"
   ],
   "answerIndex": 3
  }
 ],
 "sparta": [
  {
   "question": "How many Spartans formed the famous royal bodyguard at Thermopylae in 480 BCE?",
   "options": [
    "1,000",
    "100",
    "300",
    "3,000"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Spartan king led the stand at Thermopylae?",
   "options": [
    "Agesilaus",
    "Leonidas",
    "Lycurgus",
    "Pausanias"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Persian king invaded Greece in 480 BCE?",
   "options": [
    "Artaxerxes I",
    "Cyrus the Great",
    "Darius I",
    "Xerxes I"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the harsh Spartan military training system for boys called?",
   "options": [
    "The agoge",
    "The ephebeia",
    "The syssitia",
    "The paideia"
   ],
   "answerIndex": 0
  },
  {
   "question": "Who betrayed the Greeks by showing the Persians a path around the pass?",
   "options": [
    "Ephialtes",
    "Hippias",
    "Demaratus",
    "Themistocles"
   ],
   "answerIndex": 0
  },
  {
   "question": "What name did Spartans give to the enslaved population who farmed their land?",
   "options": [
    "Metics",
    "Helots",
    "Hoplites",
    "Perioikoi"
   ],
   "answerIndex": 1
  },
  {
   "question": "Sparta was unusual in having how many kings ruling at once?",
   "options": [
    "Five",
    "Three",
    "Two",
    "One"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which narrow coastal pass was the site of the battle?",
   "options": [
    "Corinth",
    "Delphi",
    "Marathon",
    "Thermopylae"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Spartan lawgiver is credited with creating the city's constitution?",
   "options": [
    "Solon",
    "Lycurgus",
    "Pittacus",
    "Draco"
   ],
   "answerIndex": 1
  },
  {
   "question": "Sparta eventually defeated Athens in which conflict ending in 404 BCE?",
   "options": [
    "The Corinthian War",
    "The Sacred War",
    "The Persian Wars",
    "The Peloponnesian War"
   ],
   "answerIndex": 3
  }
 ],
 "jerusalem": [
  {
   "question": "In which year was the Second Temple destroyed?",
   "options": [
    "135 CE",
    "586 BCE",
    "70 CE",
    "1099 CE"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Crusade captured Jerusalem in 1099?",
   "options": [
    "The Fourth Crusade",
    "The Second Crusade",
    "The First Crusade",
    "The Third Crusade"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Crusader state was founded after the 1099 conquest?",
   "options": [
    "The Duchy of Normandy",
    "The Kingdom of Sicily",
    "The Kingdom of Jerusalem",
    "The Kingdom of Navarre"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which golden-domed shrine stands on the Temple Mount?",
   "options": [
    "The Great Mosque of Samarkand",
    "The Blue Mosque",
    "Hagia Sophia",
    "The Dome of the Rock"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which remaining wall of the Second Temple compound is a major Jewish prayer site?",
   "options": [
    "The Eastern Gate",
    "The Damascus Wall",
    "The Northern Wall",
    "The Western Wall"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which church in Jerusalem is traditionally the site of the crucifixion and tomb of Jesus?",
   "options": [
    "Hagia Sophia",
    "The Church of the Holy Sepulchre",
    "The Church of the Nativity",
    "St Peter's Basilica"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Babylonian king destroyed the First Temple in 586 BCE?",
   "options": [
    "Cyrus the Great",
    "Sennacherib",
    "Hammurabi",
    "Nebuchadnezzar II"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which king is traditionally credited with building the First Temple?",
   "options": [
    "Herod",
    "David",
    "Solomon",
    "Hezekiah"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Roman emperor renamed the city Aelia Capitolina after 130 CE?",
   "options": [
    "Nero",
    "Hadrian",
    "Trajan",
    "Constantine"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which caliph accepted Jerusalem's surrender in 637 CE?",
   "options": [
    "Umar",
    "Ali",
    "Abu Bakr",
    "Uthman"
   ],
   "answerIndex": 0
  }
 ],
 "mecca": [
  {
   "question": "In which year did the Prophet Muhammad peacefully take Mecca?",
   "options": [
    "570 CE",
    "622 CE",
    "661 CE",
    "630 CE"
   ],
   "answerIndex": 3
  },
  {
   "question": "What is the cube-shaped structure at the centre of the Great Mosque of Mecca?",
   "options": [
    "The Dome of the Chain",
    "The Kaaba",
    "The Minaret of Jam",
    "The Mihrab"
   ],
   "answerIndex": 1
  },
  {
   "question": "What is the annual pilgrimage to Mecca called?",
   "options": [
    "The Hajj",
    "The Eid",
    "The Zakat",
    "The Ramadan"
   ],
   "answerIndex": 0
  },
  {
   "question": "The migration from Mecca to Medina in 622 CE is known as what?",
   "options": [
    "The Hijra",
    "The Mi'raj",
    "The Jihad",
    "The Isra"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which century was the Prophet Muhammad born in Mecca?",
   "options": [
    "The 6th century",
    "The 2nd century",
    "The 4th century",
    "The 8th century"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which tribe controlled Mecca and guarded the Kaaba before 630 CE?",
   "options": [
    "The Quraysh",
    "The Himyarites",
    "The Nabataeans",
    "The Ghassanids"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which sacred black stone is set into a corner of the Kaaba?",
   "options": [
    "The Blue Stone",
    "The Black Stone",
    "The Moonstone",
    "The Rosetta Stone"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which spring beside the Kaaba is believed to have appeared for Hagar and Ismail?",
   "options": [
    "Siloam",
    "Zamzam",
    "Gihon",
    "Ain Jalut"
   ],
   "answerIndex": 1
  },
  {
   "question": "Mecca lies in which region of Arabia?",
   "options": [
    "The Hejaz",
    "Yemen",
    "Oman",
    "The Najd"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which direction do Muslims face in prayer, set towards Mecca?",
   "options": [
    "The mihrab",
    "The qibla",
    "The adhan",
    "The minbar"
   ],
   "answerIndex": 1
  }
 ],
 "constantinople": [
  {
   "question": "Which emperor founded Constantinople as a new capital in 330 CE?",
   "options": [
    "Theodosius I",
    "Constantine the Great",
    "Diocletian",
    "Justinian I"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which sultan conquered Constantinople in 1453?",
   "options": [
    "Mehmed II",
    "Suleiman the Magnificent",
    "Murad II",
    "Selim I"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which great church was built under Justinian and later became a mosque?",
   "options": [
    "St Mark's Basilica",
    "The Blue Mosque",
    "Hagia Sophia",
    "Notre-Dame"
   ],
   "answerIndex": 2
  },
  {
   "question": "What was Constantinople's original Greek name before it was refounded?",
   "options": [
    "Nicaea",
    "Antioch",
    "Byzantium",
    "Thessalonica"
   ],
   "answerIndex": 2
  },
  {
   "question": "What kept the city safe for centuries before 1453?",
   "options": [
    "Hadrian's Wall",
    "The Theodosian Walls",
    "The Great Wall",
    "The Walls of Babylon"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which waterway did the city command, linking the Black Sea to the Mediterranean region?",
   "options": [
    "The Strait of Gibraltar",
    "The Strait of Messina",
    "The Suez Canal",
    "The Bosphorus"
   ],
   "answerIndex": 3
  },
  {
   "question": "The empire centred on Constantinople is usually called what?",
   "options": [
    "The Carolingian Empire",
    "The Byzantine Empire",
    "The Seljuk Empire",
    "The Holy Roman Empire"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1204 event saw the city sacked by Western knights?",
   "options": [
    "The First Crusade",
    "The Siege of Vienna",
    "The Fourth Crusade",
    "The Battle of Manzikert"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which large chariot-racing arena stood at the city's heart?",
   "options": [
    "The Stadium of Domitian",
    "The Hippodrome",
    "The Circus Maximus",
    "The Colosseum"
   ],
   "answerIndex": 1
  },
  {
   "question": "By what name is the city known today?",
   "options": [
    "Ankara",
    "Adrianople",
    "Smyrna",
    "Istanbul"
   ],
   "answerIndex": 3
  }
 ],
 "baghdad": [
  {
   "question": "Which caliph founded Baghdad in 762 CE?",
   "options": [
    "Harun al-Rashid",
    "Umar",
    "Al-Mansur",
    "Al-Ma'mun"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which dynasty ruled the caliphate from Baghdad?",
   "options": [
    "The Safavids",
    "The Abbasids",
    "The Umayyads",
    "The Fatimids"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was the renowned centre of learning and translation in Baghdad called?",
   "options": [
    "The Library of Alexandria",
    "The Great Academy",
    "The Scriptorium",
    "The House of Wisdom"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Mongol leader's army sacked Baghdad in 1258?",
   "options": [
    "Genghis Khan",
    "Kublai Khan",
    "Hulagu Khan",
    "Timur"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Abbasid caliph sponsored the great translation movement of the early 9th century?",
   "options": [
    "Al-Mutawakkil",
    "Al-Mu'tasim",
    "Al-Rashid's father Al-Mahdi",
    "Al-Ma'mun"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was Baghdad's original circular design known as?",
   "options": [
    "The Golden Gate",
    "The Moon City",
    "The Round City",
    "The Great Wheel"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which collection of stories is closely tied to Harun al-Rashid's Baghdad?",
   "options": [
    "One Thousand and One Nights",
    "The Canterbury Tales",
    "The Decameron",
    "The Shahnameh"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which scholar of the House of Wisdom is often called the father of algebra?",
   "options": [
    "Avicenna",
    "Ibn Battuta",
    "Averroes",
    "Al-Khwarizmi"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which material did Baghdad's scholars adopt, via China, to spread books widely?",
   "options": [
    "Paper",
    "Clay tablets",
    "Papyrus",
    "Parchment"
   ],
   "answerIndex": 0
  },
  {
   "question": "The Mongol siege of Baghdad ended which era?",
   "options": [
    "The Roman Empire in the East",
    "The Abbasid Caliphate's rule from Baghdad",
    "The Seljuk sultanate",
    "The Fatimid caliphate"
   ],
   "answerIndex": 1
  }
 ],
 "xi-an": [
  {
   "question": "Which ruler unified China in 221 BCE?",
   "options": [
    "Qin Shi Huang",
    "Emperor Wu of Han",
    "Kublai Khan",
    "Liu Bang"
   ],
   "answerIndex": 0
  },
  {
   "question": "What famous underground army guards the first emperor's tomb?",
   "options": [
    "The Terracotta Army",
    "The Jade Army",
    "The Stone Warriors",
    "The Bronze Guard"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which dynasty did Qin Shi Huang found?",
   "options": [
    "The Tang dynasty",
    "The Han dynasty",
    "The Qin dynasty",
    "The Zhou dynasty"
   ],
   "answerIndex": 2
  },
  {
   "question": "By what ancient name was Xi'an known as a Tang dynasty capital?",
   "options": [
    "Luoyang",
    "Nanjing",
    "Chang'an",
    "Kaifeng"
   ],
   "answerIndex": 2
  },
  {
   "question": "Xi'an was the eastern end of which trade network?",
   "options": [
    "The Spice Route",
    "The Silk Road",
    "The Amber Road",
    "The Incense Route"
   ],
   "answerIndex": 1
  },
  {
   "question": "The Terracotta Army was discovered in which year?",
   "options": [
    "1994",
    "1904",
    "1974",
    "1949"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which famous wall did the first emperor also link together and expand?",
   "options": [
    "The Great Wall",
    "The Berlin Wall",
    "The Wall of Jericho",
    "Hadrian's Wall"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which philosophy did the Qin dynasty rely on for strict rule?",
   "options": [
    "Daoism",
    "Confucianism",
    "Legalism",
    "Buddhism"
   ],
   "answerIndex": 2
  },
  {
   "question": "Roughly how many terracotta soldiers have been estimated in the pits?",
   "options": [
    "About 80",
    "About 300",
    "About 8,000",
    "About 800,000"
   ],
   "answerIndex": 2
  },
  {
   "question": "What standardised measure did the Qin introduce to unify the empire?",
   "options": [
    "Weights, measures and a script",
    "A single religion",
    "A uniform national language",
    "A universal calendar of 12 months"
   ],
   "answerIndex": 0
  }
 ],
 "beijing": [
  {
   "question": "Which Ming emperor moved the capital to Beijing and completed the Forbidden City in 1420?",
   "options": [
    "Kangxi",
    "Qianlong",
    "Hongwu",
    "Yongle"
   ],
   "answerIndex": 3
  },
  {
   "question": "What is the vast imperial palace complex at the centre of Beijing called?",
   "options": [
    "The Summer Palace",
    "The Leshan Buddha",
    "The Forbidden City",
    "The Potala Palace"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which dynasty ruled China from Beijing after the Ming fell?",
   "options": [
    "The Song",
    "The Han",
    "The Qing",
    "The Tang"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which year did China's last emperor abdicate?",
   "options": [
    "1949",
    "1900",
    "1912",
    "1925"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who was the last emperor of China?",
   "options": [
    "Puyi",
    "Hongxian",
    "Guangxu",
    "Tongzhi"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which large public square lies directly south of the Forbidden City?",
   "options": [
    "Place de la Concorde",
    "Red Square",
    "Tiananmen Square",
    "Trafalgar Square"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which year was the People's Republic of China proclaimed in Beijing?",
   "options": [
    "1959",
    "1937",
    "1945",
    "1949"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Mongol-led dynasty had earlier made the city its capital, calling it Dadu?",
   "options": [
    "The Jin",
    "The Zhou",
    "The Yuan",
    "The Sui"
   ],
   "answerIndex": 2
  },
  {
   "question": "What did emperors do at Beijing's Temple of Heaven each year?",
   "options": [
    "Hold the civil service exams",
    "Review the imperial army",
    "Pray for good harvests",
    "Collect annual taxes"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which colour of glazed roof tile was reserved for the emperor's palaces?",
   "options": [
    "Black",
    "Blue",
    "Green",
    "Yellow"
   ],
   "answerIndex": 3
  }
 ],
 "kyoto": [
  {
   "question": "What was Kyoto called when it became Japan's capital in 794?",
   "options": [
    "Edo",
    "Nara",
    "Heian-kyo",
    "Kamakura"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which emperor moved the capital to Heian-kyo?",
   "options": [
    "Kanmu",
    "Meiji",
    "Tenmu",
    "Shomu"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year did the imperial court leave Kyoto for Tokyo?",
   "options": [
    "1603",
    "1945",
    "1868",
    "1185"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Heian-era work by Murasaki Shikibu is often called the first novel?",
   "options": [
    "The Hojoki",
    "The Pillow Book",
    "The Kojiki",
    "The Tale of Genji"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which gold-leaf-covered temple in Kyoto is formally named Rokuon-ji?",
   "options": [
    "Kinkaku-ji",
    "Todai-ji",
    "Kiyomizu-dera",
    "Ginkaku-ji"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which warrior family's shogunate ruled from Kyoto's Muromachi district from 1336?",
   "options": [
    "The Ashikaga",
    "The Minamoto",
    "The Hojo",
    "The Tokugawa"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which shrine famous for thousands of red torii gates stands in Kyoto?",
   "options": [
    "Ise",
    "Meiji Jingu",
    "Fushimi Inari",
    "Itsukushima"
   ],
   "answerIndex": 2
  },
  {
   "question": "What are the traditional entertainers of Kyoto's Gion district called?",
   "options": [
    "Ronin",
    "Sumo",
    "Shinobi",
    "Geiko"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which July festival is Kyoto's most famous?",
   "options": [
    "The Awa Odori",
    "The Sapporo Snow Festival",
    "The Tanabata Festival",
    "The Gion Matsuri"
   ],
   "answerIndex": 3
  },
  {
   "question": "In 1994 UNESCO added Kyoto's historic monuments to which list?",
   "options": [
    "The Intangible Heritage List",
    "The Biosphere Reserve list",
    "The World Heritage List",
    "The Memory of the World Register"
   ],
   "answerIndex": 2
  }
 ],
 "delhi": [
  {
   "question": "Which sultanate was founded in Delhi in 1206?",
   "options": [
    "The Maratha Empire",
    "The Vijayanagara Empire",
    "The Mughal Empire",
    "The Delhi Sultanate"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who founded the Delhi Sultanate's first dynasty?",
   "options": [
    "Muhammad Tughlaq",
    "Qutb ud-Din Aibak",
    "Alauddin Khalji",
    "Iltutmish"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which tall victory tower in Delhi was begun by Qutb ud-Din Aibak?",
   "options": [
    "The Qutb Minar",
    "The Gateway of India",
    "The Charminar",
    "The Jantar Mantar"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which fortress-palace in Old Delhi hosts the Independence Day flag-raising?",
   "options": [
    "The Lotus Temple",
    "The Purana Qila",
    "Humayun's Tomb",
    "The Red Fort"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was Shah Jahan's walled city in Delhi called?",
   "options": [
    "Shahjahanabad",
    "Tughlaqabad",
    "Siri",
    "Fatehpur Sikri"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year did India gain independence?",
   "options": [
    "1935",
    "1942",
    "1950",
    "1947"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who gave the 'Tryst with Destiny' speech on the eve of independence?",
   "options": [
    "Subhas Chandra Bose",
    "Jawaharlal Nehru",
    "Sardar Patel",
    "Mahatma Gandhi"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which British architect led the planning of New Delhi?",
   "options": [
    "Christopher Wren",
    "Le Corbusier",
    "Charles Barry",
    "Edwin Lutyens"
   ],
   "answerIndex": 3
  },
  {
   "question": "In which year was the move of the capital from Calcutta to Delhi announced?",
   "options": [
    "1900",
    "1911",
    "1857",
    "1947"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Persian ruler sacked Delhi in 1739 and took the Peacock Throne?",
   "options": [
    "Nader Shah",
    "Ahmad Shah Abdali",
    "Timur",
    "Babur"
   ],
   "answerIndex": 0
  }
 ],
 "agra": [
  {
   "question": "Which Mughal emperor commissioned the Taj Mahal?",
   "options": [
    "Akbar",
    "Babur",
    "Shah Jahan",
    "Aurangzeb"
   ],
   "answerIndex": 2
  },
  {
   "question": "For whom was the Taj Mahal built as a tomb?",
   "options": [
    "Nur Jahan",
    "Mumtaz Mahal",
    "Jodha Bai",
    "Razia Sultana"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which white stone covers the Taj Mahal?",
   "options": [
    "Makrana marble",
    "Travertine",
    "Carrara marble",
    "Red sandstone"
   ],
   "answerIndex": 0
  },
  {
   "question": "What four tall structures stand at the corners of the Taj Mahal's plinth?",
   "options": [
    "Minarets",
    "Lighthouses",
    "Obelisks",
    "Pagodas"
   ],
   "answerIndex": 0
  },
  {
   "question": "Around which year was the Taj Mahal complex completed?",
   "options": [
    "1707",
    "1757",
    "1653",
    "1526"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which architectural tradition blends Persian, Islamic and Indian elements?",
   "options": [
    "Baroque",
    "Byzantine",
    "Gothic",
    "Mughal"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Agra fortress, begun under Akbar, later held Shah Jahan under house arrest?",
   "options": [
    "Golconda Fort",
    "Agra Fort",
    "Mehrangarh Fort",
    "Amber Fort"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which son imprisoned Shah Jahan at the end of his reign?",
   "options": [
    "Murad Bakhsh",
    "Aurangzeb",
    "Jahangir",
    "Dara Shikoh"
   ],
   "answerIndex": 1
  },
  {
   "question": "About how many workers are traditionally said to have built the Taj Mahal?",
   "options": [
    "About 200",
    "About 2 million",
    "About 20,000",
    "About 2,000"
   ],
   "answerIndex": 2
  },
  {
   "question": "What kind of building is the Taj Mahal?",
   "options": [
    "A royal palace",
    "A university",
    "A mausoleum",
    "A fortress"
   ],
   "answerIndex": 2
  }
 ],
 "cairo": [
  {
   "question": "Which dynasty founded Cairo in 969 CE?",
   "options": [
    "The Fatimids",
    "The Mamluks",
    "The Ayyubids",
    "The Abbasids"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Fatimid general founded the city?",
   "options": [
    "Amr ibn al-As",
    "Jawhar al-Siqilli",
    "Saladin",
    "Baibars"
   ],
   "answerIndex": 1
  },
  {
   "question": "What does the city's Arabic name, Al-Qahira, broadly mean?",
   "options": [
    "The Gate of the Nile",
    "The City of Minarets",
    "The Victorious",
    "The Mother of the World"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which mosque, founded around 970, grew into one of the world's oldest universities?",
   "options": [
    "Al-Azhar",
    "Ibn Tulun",
    "The Blue Mosque",
    "Sultan Hassan"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Ayyubid ruler began Cairo's famous Citadel?",
   "options": [
    "Muhammad Ali",
    "Baibars",
    "Saladin",
    "Qalawun"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is Cairo's sprawling medieval bazaar district called?",
   "options": [
    "Khan el-Khalili",
    "The Grand Bazaar",
    "Chandni Chowk",
    "Souk Waqif"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which earlier settlement, founded in 641, preceded Cairo as the capital?",
   "options": [
    "Thebes",
    "Memphis",
    "Fustat",
    "Alexandria"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which dynasty of former slave soldiers governed Egypt from Cairo from 1250?",
   "options": [
    "The Ptolemies",
    "The Fatimids",
    "The Umayyads",
    "The Mamluks"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which French general entered Cairo in 1798?",
   "options": [
    "Lafayette",
    "Charles de Gaulle",
    "Marshal Ney",
    "Napoleon Bonaparte"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Ottoman sultan conquered Egypt in 1517?",
   "options": [
    "Selim I",
    "Mehmed II",
    "Suleiman the Magnificent",
    "Murad IV"
   ],
   "answerIndex": 0
  }
 ],
 "giza": [
  {
   "question": "Which pharaoh built the Great Pyramid of Giza?",
   "options": [
    "Khufu",
    "Ramesses II",
    "Khafre",
    "Menkaure"
   ],
   "answerIndex": 0
  },
  {
   "question": "To which dynasty did Khufu belong?",
   "options": [
    "The Fourth",
    "The Twenty-sixth",
    "The Eighteenth",
    "The First"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how tall was the Great Pyramid when completed?",
   "options": [
    "About 246 metres",
    "About 146 metres",
    "About 46 metres",
    "About 346 metres"
   ],
   "answerIndex": 1
  },
  {
   "question": "The Great Sphinx combines which two forms?",
   "options": [
    "A serpent's body and a human head",
    "A bull's body and a falcon's head",
    "An eagle's body and a lion's head",
    "A lion's body and a human head"
   ],
   "answerIndex": 3
  },
  {
   "question": "Whose face is the Sphinx most often thought to portray?",
   "options": [
    "Tutankhamun",
    "Akhenaten",
    "Cleopatra",
    "Khafre"
   ],
   "answerIndex": 3
  },
  {
   "question": "The Great Pyramid is the only survivor of which famous list?",
   "options": [
    "The Seven Seas",
    "The Seven Wonders of the Ancient World",
    "The Seven Sages of Greece",
    "The Seven Hills of Rome"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which stone makes up most of the pyramid's blocks?",
   "options": [
    "Limestone",
    "Basalt",
    "Marble",
    "Obsidian"
   ],
   "answerIndex": 0
  },
  {
   "question": "For roughly how long was the Great Pyramid the tallest human-made structure?",
   "options": [
    "About 38 years",
    "About 3,800 years",
    "About 38,000 years",
    "About 380 years"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which bank of the Nile do the Giza pyramids stand?",
   "options": [
    "The Delta's northern shore",
    "The west bank",
    "An island in the river",
    "The east bank"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was the main purpose of the pyramids?",
   "options": [
    "Royal tombs",
    "Grain stores",
    "Astronomical observatories",
    "Public temples"
   ],
   "answerIndex": 0
  }
 ],
 "alexandria": [
  {
   "question": "Who founded Alexandria in 331 BCE?",
   "options": [
    "Ptolemy I",
    "Julius Caesar",
    "Alexander the Great",
    "Augustus"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which ancient wonder stood on the island of Pharos?",
   "options": [
    "The Colossus of Rhodes",
    "The Lighthouse",
    "The Statue of Zeus",
    "The Temple of Artemis"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which dynasty ruled Egypt from Alexandria after Alexander's death?",
   "options": [
    "The Antigonids",
    "The Seleucids",
    "The Fatimids",
    "The Ptolemies"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which great institution gathered scrolls from across the known world?",
   "options": [
    "The House of Wisdom",
    "The Academy",
    "The Lyceum",
    "The Library of Alexandria"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which famous queen was the last Ptolemaic ruler?",
   "options": [
    "Nefertiti",
    "Hatshepsut",
    "Nitocris",
    "Cleopatra VII"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which mathematician who wrote the Elements worked in Alexandria?",
   "options": [
    "Thales",
    "Archimedes",
    "Euclid",
    "Pythagoras"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which scholar of Alexandria estimated the Earth's circumference around 240 BCE?",
   "options": [
    "Strabo",
    "Aristotle",
    "Eratosthenes",
    "Hipparchus"
   ],
   "answerIndex": 2
  },
  {
   "question": "On which sea does Alexandria lie?",
   "options": [
    "The Mediterranean",
    "The Red Sea",
    "The Adriatic",
    "The Black Sea"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Roman ally of Cleopatra was defeated at Actium in 31 BCE?",
   "options": [
    "Pompey",
    "Mark Antony",
    "Brutus",
    "Sulla"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which of Alexander's generals founded the dynasty that ruled from the city?",
   "options": [
    "Ptolemy",
    "Antigonus",
    "Cassander",
    "Seleucus"
   ],
   "answerIndex": 0
  }
 ],
 "carthage": [
  {
   "question": "Which Roman commander destroyed Carthage in 146 BCE?",
   "options": [
    "Pompey",
    "Scipio Aemilianus",
    "Julius Caesar",
    "Marcus Crassus"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which conflict ended with the destruction of Carthage?",
   "options": [
    "The Third Punic War",
    "The Gallic Wars",
    "The Samnite Wars",
    "The Social War"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Carthaginian general crossed the Alps with war elephants?",
   "options": [
    "Hannibal",
    "Mago",
    "Hasdrubal",
    "Hamilcar"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Roman senator ended his speeches urging that Carthage must be destroyed?",
   "options": [
    "Sulla",
    "Cicero",
    "Cato the Elder",
    "Marius"
   ],
   "answerIndex": 2
  },
  {
   "question": "From which Phoenician city did Carthage's founders come?",
   "options": [
    "Sidon",
    "Byblos",
    "Tyre",
    "Ugarit"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which legendary queen is credited with founding Carthage?",
   "options": [
    "Cleopatra",
    "Dido",
    "Zenobia",
    "Hatshepsut"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 202 BCE battle ended the Second Punic War?",
   "options": [
    "Zama",
    "Trebia",
    "Lake Trasimene",
    "Cannae"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the Carthaginian military harbour called?",
   "options": [
    "The Ostia",
    "The Piraeus",
    "The Cothon",
    "The Pharos"
   ],
   "answerIndex": 2
  },
  {
   "question": "Hannibal's famous victory at Cannae happened in which Punic War?",
   "options": [
    "The First",
    "The Second",
    "The Fourth",
    "The Third"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which waters did Carthage dominate with its fleet and trade?",
   "options": [
    "The western Mediterranean",
    "The Red Sea",
    "The Baltic Sea",
    "The Indian Ocean"
   ],
   "answerIndex": 0
  }
 ],
 "timbuktu": [
  {
   "question": "Which Mali ruler made a famous pilgrimage to Mecca in 1324?",
   "options": [
    "Sundiata Keita",
    "Askia Muhammad",
    "Mansa Musa",
    "Sonni Ali"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which empire held Timbuktu in the 14th century?",
   "options": [
    "The Mali Empire",
    "The Ghana Empire",
    "The Ashanti Empire",
    "The Kanem Empire"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which two goods were most famously traded across the Sahara to Timbuktu?",
   "options": [
    "Gold and salt",
    "Silk and spices",
    "Tea and porcelain",
    "Coffee and cocoa"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which famous mosque and learning centre stands in Timbuktu?",
   "options": [
    "Zaytuna",
    "Al-Azhar",
    "Sankore",
    "Karaouine"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Timbuktu mosque, completed in 1327, is among the city's oldest?",
   "options": [
    "Great Mosque of Djenné",
    "Djinguereber",
    "Hassan II",
    "Koutoubia"
   ],
   "answerIndex": 1
  },
  {
   "question": "What building material gives Timbuktu's old mosques their distinctive look?",
   "options": [
    "Granite",
    "Timber",
    "Mud-brick",
    "Marble"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which empire took Timbuktu in the late 15th century and made it a scholarly hub?",
   "options": [
    "The Ghana Empire",
    "The Songhai Empire",
    "The Mali Empire",
    "The Ottoman Empire"
   ],
   "answerIndex": 1
  },
  {
   "question": "Caravans carrying goods to the city crossed which desert?",
   "options": [
    "The Sahara",
    "The Kalahari",
    "The Arabian Desert",
    "The Gobi"
   ],
   "answerIndex": 0
  },
  {
   "question": "What fills the private libraries of Timbuktu that scholars still guard today?",
   "options": [
    "Stone inscriptions",
    "Manuscripts",
    "Papyrus scrolls",
    "Clay tablets"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which army from Morocco defeated the Songhai in 1591?",
   "options": [
    "The French army",
    "The Portuguese army",
    "The Ottoman army",
    "The Saadian army"
   ],
   "answerIndex": 3
  }
 ],
 "great-zimbabwe": [
  {
   "question": "What does the name 'Zimbabwe' roughly mean in Shona?",
   "options": [
    "Great river",
    "Land of kings",
    "Stone houses",
    "Gold city"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which stone were the walls built from, without mortar?",
   "options": [
    "Sandstone",
    "Basalt",
    "Granite",
    "Marble"
   ],
   "answerIndex": 2
  },
  {
   "question": "Great Zimbabwe is linked to the ancestors of which people?",
   "options": [
    "The Zulu",
    "The Shona",
    "The Berbers",
    "The Maasai"
   ],
   "answerIndex": 1
  },
  {
   "question": "Great Zimbabwe grew rich from trading which pair of goods?",
   "options": [
    "Coffee and sugar",
    "Oil and wine",
    "Gold and ivory",
    "Silk and tea"
   ],
   "answerIndex": 2
  },
  {
   "question": "Great Zimbabwe's trade reached which coast?",
   "options": [
    "The Red Sea coast",
    "The Atlantic coast",
    "The East African coast",
    "The Mediterranean coast"
   ],
   "answerIndex": 2
  },
  {
   "question": "About how high do the Great Enclosure's walls rise?",
   "options": [
    "Up to about 2 metres",
    "Up to about 30 metres",
    "Up to about 11 metres",
    "Up to about 50 metres"
   ],
   "answerIndex": 2
  },
  {
   "question": "The soapstone bird carvings found here became the emblem of which country?",
   "options": [
    "Zimbabwe",
    "Botswana",
    "Mozambique",
    "Zambia"
   ],
   "answerIndex": 0
  },
  {
   "question": "Roughly how many people may have lived there at its peak?",
   "options": [
    "About 180",
    "About 1.8 million",
    "Up to about 18,000",
    "About 800"
   ],
   "answerIndex": 2
  },
  {
   "question": "Near which modern town does the site lie?",
   "options": [
    "Bulawayo",
    "Mutare",
    "Masvingo",
    "Harare"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is one theory for why the site was abandoned around the mid-15th century?",
   "options": [
    "Strained resources and shifting trade routes",
    "A volcanic eruption",
    "A Portuguese invasion",
    "A great flood"
   ],
   "answerIndex": 0
  }
 ],
 "cusco": [
  {
   "question": "According to tradition, who founded Cusco?",
   "options": [
    "Manco Cápac",
    "Huayna Capac",
    "Pachacuti",
    "Atahualpa"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which empire had Cusco as its capital?",
   "options": [
    "The Maya",
    "The Inca Empire",
    "The Chimú",
    "The Aztec Empire"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Inca ruler transformed Cusco into an imperial capital in the 15th century?",
   "options": [
    "Pachacuti",
    "Túpac Amaru",
    "Manco Inca",
    "Atahualpa"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the Inca name for their empire, meaning 'four parts'?",
   "options": [
    "Qullasuyu",
    "Tawantinsuyu",
    "Pachamama",
    "Antisuyu"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which system of knotted cords did the Inca use for record-keeping?",
   "options": [
    "Wampum",
    "Quipu",
    "Cuneiform",
    "Hieroglyphs"
   ],
   "answerIndex": 1
  },
  {
   "question": "The layout of Cusco was said to resemble which animal?",
   "options": [
    "A serpent",
    "A puma",
    "A condor",
    "A llama"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which conquistador entered Cusco in 1533?",
   "options": [
    "Francisco Pizarro",
    "Hernán Cortés",
    "Vasco Núñez de Balboa",
    "Pedro de Valdivia"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which sun temple in Cusco was later built over by a Spanish church?",
   "options": [
    "Ollantaytambo",
    "Qorikancha",
    "Pisac",
    "Chan Chan"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which massive fortress overlooks Cusco?",
   "options": [
    "Choquequirao",
    "Kuelap",
    "Sacsayhuamán",
    "Tiwanaku"
   ],
   "answerIndex": 2
  },
  {
   "question": "Inca stonework is famed for fitting stones so tightly that it does what?",
   "options": [
    "Survives earthquakes",
    "Lets water through",
    "Shows iron tool marks",
    "Needs mortar to hold"
   ],
   "answerIndex": 0
  }
 ],
 "mexico-city": [
  {
   "question": "Mexico City was built on the ruins of which Aztec capital?",
   "options": [
    "Tula",
    "Teotihuacan",
    "Texcoco",
    "Tenochtitlan"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which conquistador led the campaign that ended with the fall of Tenochtitlan in 1521?",
   "options": [
    "Hernán Cortés",
    "Pedro de Alvarado",
    "Francisco de Coronado",
    "Francisco Pizarro"
   ],
   "answerIndex": 0
  },
  {
   "question": "Who was the last Aztec emperor, captured in 1521?",
   "options": [
    "Cuauhtémoc",
    "Ahuitzotl",
    "Itzcoatl",
    "Moctezuma II"
   ],
   "answerIndex": 0
  },
  {
   "question": "Where was Tenochtitlan built?",
   "options": [
    "On an island in Lake Texcoco",
    "In a river delta",
    "On a mountaintop",
    "On a coastal cliff"
   ],
   "answerIndex": 0
  },
  {
   "question": "What were the Aztecs' artificial garden-islands called?",
   "options": [
    "Haciendas",
    "Terraces",
    "Chinampas",
    "Milpas"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which colony was governed from Mexico City by a viceroy?",
   "options": [
    "Peru",
    "Río de la Plata",
    "New Granada",
    "New Spain"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which upheaval began in Mexico in 1910?",
   "options": [
    "The Mexican Revolution",
    "The Texas Revolution",
    "The Cristero War",
    "The Reform War"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which long-ruling president was forced out in 1911?",
   "options": [
    "Porfirio Díaz",
    "Maximilian I",
    "Benito Juárez",
    "Santa Anna"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which priest launched the 1810 call for independence, the Grito de Dolores?",
   "options": [
    "Miguel Hidalgo",
    "José María Morelos",
    "Vicente Guerrero",
    "Agustín de Iturbide"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Aztec temple's ruins were uncovered in Mexico City in 1978?",
   "options": [
    "Monte Albán",
    "The Pyramid of the Sun",
    "El Castillo",
    "Templo Mayor"
   ],
   "answerIndex": 3
  }
 ],
 "paris": [
  {
   "question": "On which date did Parisians storm the Bastille?",
   "options": [
    "14 July 1789",
    "4 July 1776",
    "1 May 1789",
    "21 January 1793"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the Bastille?",
   "options": [
    "A parliament hall",
    "A royal palace",
    "A royal fortress and prison",
    "A cathedral"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which king ruled France when the Revolution began in 1789?",
   "options": [
    "Louis XVIII",
    "Louis XVI",
    "Louis XIV",
    "Charles X"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1789 document proclaimed liberty, equality and basic rights?",
   "options": [
    "The Declaration of the Rights of Man and of the Citizen",
    "Magna Carta",
    "The Bill of Rights",
    "The Napoleonic Code"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did the Third Estate declare itself in June 1789?",
   "options": [
    "The Senate",
    "The Convention",
    "The National Assembly",
    "The Directory"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which three colours make up the French tricolour?",
   "options": [
    "Black, red and gold",
    "Green, white and red",
    "Blue, yellow and red",
    "Blue, white and red"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which motto became associated with the Revolution?",
   "options": [
    "God and my right",
    "Liberty, equality, fraternity",
    "Always forward",
    "Out of many, one"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which device was used for executions during the Terror?",
   "options": [
    "The garrote",
    "The rack",
    "The gallows",
    "The guillotine"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which 1783 treaty signed in Paris ended the American Revolutionary War?",
   "options": [
    "The Treaty of Utrecht",
    "The Treaty of Ghent",
    "The Treaty of Paris",
    "The Treaty of Tordesillas"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which family built the hot-air balloon that carried the first human flight over Paris in 1783?",
   "options": [
    "The Goncourt brothers",
    "The Wright brothers",
    "The Montgolfier brothers",
    "The Lumière brothers"
   ],
   "answerIndex": 2
  }
 ],
 "versailles": [
  {
   "question": "On which date was the Treaty of Versailles signed?",
   "options": [
    "28 July 1914",
    "28 June 1919",
    "11 November 1918",
    "1 September 1939"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which famous room was the treaty signed?",
   "options": [
    "The Royal Chapel",
    "The Oval Office",
    "The Hall of Mirrors",
    "The Throne Room"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which war did the treaty formally end with Germany?",
   "options": [
    "The First World War",
    "The Franco-Prussian War",
    "The Crimean War",
    "The Second World War"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the treaty's clause blaming Germany for the war known as?",
   "options": [
    "The Rhine clause",
    "The war guilt clause",
    "The reparations veto",
    "The Monroe clause"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which US president joined the peace talks?",
   "options": [
    "William Taft",
    "Franklin Roosevelt",
    "Woodrow Wilson",
    "Theodore Roosevelt"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which French premier, nicknamed 'the Tiger', pushed for a harsh peace?",
   "options": [
    "Charles de Gaulle",
    "Raymond Poincaré",
    "Aristide Briand",
    "Georges Clemenceau"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which international organisation did the treaty create?",
   "options": [
    "The League of Nations",
    "The United Nations",
    "The Red Cross",
    "NATO"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which territory did Germany return to France?",
   "options": [
    "Corsica",
    "Savoy",
    "Normandy",
    "Alsace-Lorraine"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which king turned Versailles into a grand palace and moved the court there?",
   "options": [
    "Henry IV",
    "Napoleon III",
    "Louis XVI",
    "Louis XIV"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who was proclaimed German Emperor at Versailles in 1871?",
   "options": [
    "Wilhelm II",
    "Otto von Bismarck",
    "Frederick the Great",
    "Wilhelm I"
   ],
   "answerIndex": 3
  }
 ],
 "london": [
  {
   "question": "In which year did the Great Fire of London break out?",
   "options": [
    "1066",
    "1665",
    "1766",
    "1666"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which street did the fire start in a bakery?",
   "options": [
    "Fleet Street",
    "Oxford Street",
    "Baker Street",
    "Pudding Lane"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which architect rebuilt St Paul's Cathedral after the fire?",
   "options": [
    "Christopher Wren",
    "Nicholas Hawksmoor",
    "Inigo Jones",
    "John Nash"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which column commemorates the Great Fire?",
   "options": [
    "Nelson's Column",
    "The Monument",
    "Marble Arch",
    "Wellington Arch"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which outbreak devastated London the year before the fire?",
   "options": [
    "Typhus",
    "Smallpox",
    "Cholera",
    "The Great Plague"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which diarist famously recorded the fire?",
   "options": [
    "James Boswell",
    "Daniel Defoe",
    "Samuel Pepys",
    "Charles Dickens"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which fortress on the Thames did William the Conqueror begin?",
   "options": [
    "Hampton Court",
    "Windsor Castle",
    "Dover Castle",
    "The Tower of London"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which famous bascule bridge stands beside the Tower of London?",
   "options": [
    "Tower Bridge",
    "Waterloo Bridge",
    "Westminster Bridge",
    "London Bridge"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how many houses did the fire destroy?",
   "options": [
    "About 1,300",
    "About 13,000",
    "About 130,000",
    "About 130"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which king was on the throne during the Great Fire?",
   "options": [
    "James II",
    "Charles II",
    "William III",
    "Charles I"
   ],
   "answerIndex": 1
  }
 ],
 "runnymede": [
  {
   "question": "Which king sealed Magna Carta at Runnymede in 1215?",
   "options": [
    "Richard I",
    "King John",
    "Edward I",
    "Henry III"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which month was Magna Carta sealed?",
   "options": [
    "January",
    "June",
    "September",
    "December"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which royal power did the charter most notably limit?",
   "options": [
    "Raising taxes without consent",
    "Appointing bishops",
    "Minting coins",
    "Declaring war on France"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which group forced the king to accept the charter?",
   "options": [
    "The London guilds",
    "The Scottish clans",
    "The bishops of Rome",
    "The rebel barons"
   ],
   "answerIndex": 3
  },
  {
   "question": "What does the Latin name Magna Carta mean?",
   "options": [
    "Great Charter",
    "Royal Decree",
    "King's Peace",
    "Free Law"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which pope annulled the charter soon afterwards?",
   "options": [
    "Gregory VII",
    "Boniface VIII",
    "Urban II",
    "Innocent III"
   ],
   "answerIndex": 3
  },
  {
   "question": "Magna Carta promised no free man could be punished except by what?",
   "options": [
    "A royal decree",
    "A papal order",
    "The sheriff's choice",
    "The lawful judgment of his peers or the law of the land"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which archbishop helped negotiate the charter?",
   "options": [
    "Anselm",
    "Thomas Cranmer",
    "Thomas Becket",
    "Stephen Langton"
   ],
   "answerIndex": 3
  },
  {
   "question": "Roughly how many clauses did the 1215 charter contain?",
   "options": [
    "12",
    "150",
    "63",
    "7"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which later American document drew on Magna Carta's ideas?",
   "options": [
    "The Napoleonic Code",
    "The Code of Hammurabi",
    "The US Bill of Rights",
    "The Communist Manifesto"
   ],
   "answerIndex": 2
  }
 ],
 "moscow": [
  {
   "question": "Which leader headed the Bolsheviks when they took power in 1917?",
   "options": [
    "Alexander Kerensky",
    "Joseph Stalin",
    "Vladimir Lenin",
    "Nikita Khrushchev"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which fortress complex became the seat of Soviet government?",
   "options": [
    "The Winter Palace",
    "The Lubyanka",
    "Peterhof",
    "The Kremlin"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which famous square lies beside the Kremlin?",
   "options": [
    "Times Square",
    "Tahrir Square",
    "Palace Square",
    "Red Square"
   ],
   "answerIndex": 3
  },
  {
   "question": "In which year was the Soviet Union formally created?",
   "options": [
    "1922",
    "1945",
    "1917",
    "1936"
   ],
   "answerIndex": 0
  },
  {
   "question": "Who led the Provisional Government that the Bolsheviks overthrew?",
   "options": [
    "Leon Trotsky",
    "Lavr Kornilov",
    "Alexander Kerensky",
    "Mikhail Gorbachev"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which three-part slogan did the Bolsheviks promise?",
   "options": [
    "Peace, Land and Bread",
    "Work, Family, Fatherland",
    "Faith, Tsar and Country",
    "Liberty, Equality, Fraternity"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which city became the Bolshevik capital in March 1918?",
   "options": [
    "Petrograd",
    "Moscow",
    "Kiev",
    "Minsk"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which colourful onion-domed cathedral stands on Red Square?",
   "options": [
    "Hagia Sophia",
    "St Isaac's Cathedral",
    "Kazan Cathedral",
    "St Basil's Cathedral"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which 1918 treaty took Russia out of the First World War?",
   "options": [
    "Brest-Litovsk",
    "Rapallo",
    "Versailles",
    "Portsmouth"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which two sides fought the Russian Civil War?",
   "options": [
    "The Guelphs and the Ghibellines",
    "The Reds and the Whites",
    "The Blues and the Greens",
    "The Roundheads and the Cavaliers"
   ],
   "answerIndex": 1
  }
 ],
 "st-petersburg": [
  {
   "question": "What was St Petersburg called in 1917?",
   "options": [
    "Leningrad",
    "Novgorod",
    "Petrograd",
    "Stalingrad"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which palace was stormed during the October Revolution?",
   "options": [
    "Peterhof",
    "Catherine Palace",
    "The Kremlin",
    "The Winter Palace"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which cruiser's shot signalled the assault?",
   "options": [
    "The Varyag",
    "The Aurora",
    "The Potemkin",
    "The Bismarck"
   ],
   "answerIndex": 1
  },
  {
   "question": "Who founded St Petersburg in 1703?",
   "options": [
    "Catherine the Great",
    "Peter the Great",
    "Ivan the Terrible",
    "Nicholas II"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which dynasty did the last tsar, Nicholas II, belong to?",
   "options": [
    "The Romanovs",
    "The Habsburgs",
    "The Rurikids",
    "The Hohenzollerns"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which novelist set Crime and Punishment in St Petersburg?",
   "options": [
    "Leo Tolstoy",
    "Ivan Turgenev",
    "Anton Chekhov",
    "Fyodor Dostoevsky"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which world-famous museum fills the Winter Palace?",
   "options": [
    "The Louvre",
    "The Uffizi",
    "The Prado",
    "The Hermitage"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the city renamed in 1924?",
   "options": [
    "Kirov",
    "Stalingrad",
    "Leningrad",
    "Petrograd"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which siege lasted roughly 900 days in the Second World War?",
   "options": [
    "The Siege of Sevastopol",
    "The Siege of Vienna",
    "The Siege of Leningrad",
    "The Siege of Stalingrad"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which sea does the city's gulf open onto?",
   "options": [
    "The Baltic Sea",
    "The Black Sea",
    "The Caspian Sea",
    "The White Sea"
   ],
   "answerIndex": 0
  }
 ],
 "berlin": [
  {
   "question": "On which date did the Berlin Wall fall?",
   "options": [
    "9 November 1989",
    "3 October 1990",
    "17 June 1953",
    "8 May 1945"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year was the Berlin Wall built?",
   "options": [
    "1961",
    "1971",
    "1949",
    "1953"
   ],
   "answerIndex": 0
  },
  {
   "question": "Into which two states was Germany divided after the war?",
   "options": [
    "North and South Germany",
    "Prussia and Bavaria",
    "West Germany and East Germany",
    "Saxony and Hesse"
   ],
   "answerIndex": 2
  },
  {
   "question": "What was the best-known crossing point between East and West Berlin?",
   "options": [
    "Checkpoint Charlie",
    "Bridge of Spies Gate",
    "Checkpoint Alpha",
    "Potsdam Gate"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which 1948 to 1949 operation supplied West Berlin by air?",
   "options": [
    "The Berlin Airlift",
    "The Marshall Plan",
    "Operation Market Garden",
    "Operation Overlord"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Soviet leader's reforms of the 1980s eased the end of the Cold War?",
   "options": [
    "Joseph Stalin",
    "Yuri Andropov",
    "Leonid Brezhnev",
    "Mikhail Gorbachev"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which landmark gate became a symbol of division and reunification?",
   "options": [
    "The Porta Nigra",
    "The Holstentor",
    "The Karlstor",
    "The Brandenburg Gate"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which US president called on the Soviets to 'tear down this wall'?",
   "options": [
    "Ronald Reagan",
    "Jimmy Carter",
    "Richard Nixon",
    "John F. Kennedy"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which army captured Berlin in May 1945?",
   "options": [
    "The Soviet Red Army",
    "The British Army",
    "The Free French Army",
    "The US Army"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year was Germany reunified?",
   "options": [
    "1987",
    "1992",
    "1990",
    "1989"
   ],
   "answerIndex": 2
  }
 ],
 "nuremberg": [
  {
   "question": "Which body tried leading Nazi figures at Nuremberg?",
   "options": [
    "The League of Nations Court",
    "The International Military Tribunal",
    "The Hague Tribunal",
    "The Supreme Court"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which senior Nazi was the highest-ranking defendant at the main trial?",
   "options": [
    "Adolf Hitler",
    "Hermann Göring",
    "Joseph Goebbels",
    "Heinrich Himmler"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which US Supreme Court justice served as chief American prosecutor?",
   "options": [
    "Felix Frankfurter",
    "Earl Warren",
    "Hugo Black",
    "Robert H. Jackson"
   ],
   "answerIndex": 3
  },
  {
   "question": "How many defendants were tried in the main trial?",
   "options": [
    "5",
    "22",
    "300",
    "100"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which four powers sat in judgment?",
   "options": [
    "The US, UK, China and Japan",
    "The UK, Poland, Belgium and Norway",
    "The US, Italy, Spain and Canada",
    "The US, UK, USSR and France"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which crime category was prosecuted at the trials for the first time?",
   "options": [
    "Treason",
    "Tax evasion",
    "Piracy",
    "Crimes against humanity"
   ],
   "answerIndex": 3
  },
  {
   "question": "Nuremberg was earlier famous as the site of what?",
   "options": [
    "The signing of the Magna Carta",
    "The first Olympic Games",
    "A world's fair",
    "Annual Nazi Party rallies"
   ],
   "answerIndex": 3
  },
  {
   "question": "What name is given to the Nazi race laws of 1935?",
   "options": [
    "The Nuremberg Laws",
    "The Reich Charter",
    "The Munich Statutes",
    "The Berlin Decrees"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which principles drawn from the trials guide later international law?",
   "options": [
    "The Nuremberg Principles",
    "The Vienna Rules",
    "The Geneva Principles",
    "The Hague Maxims"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which courthouse hosted the trial?",
   "options": [
    "The Palace of Justice",
    "The Old Bailey",
    "The Rathaus",
    "The Reichstag"
   ],
   "answerIndex": 0
  }
 ],
 "vienna": [
  {
   "question": "Which Austrian statesman presided over the Congress of Vienna?",
   "options": [
    "Prince Talleyrand",
    "Otto von Bismarck",
    "Count Cavour",
    "Klemens von Metternich"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the Congress's central aim after Napoleon's fall?",
   "options": [
    "Abolishing monarchies",
    "Dividing the Americas",
    "Restoring a balance of power in Europe",
    "Forming a European parliament"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which French diplomat skilfully defended France's interests there?",
   "options": [
    "Richelieu",
    "Fouché",
    "Mazarin",
    "Talleyrand"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which tsar attended the Congress?",
   "options": [
    "Alexander I",
    "Peter the Great",
    "Nicholas II",
    "Ivan IV"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which British foreign secretary represented Britain?",
   "options": [
    "Lord Castlereagh",
    "Lord Palmerston",
    "William Pitt",
    "Benjamin Disraeli"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which state gained the Rhineland and part of Saxony?",
   "options": [
    "Prussia",
    "Bavaria",
    "Denmark",
    "Sardinia"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which loose union replaced the Holy Roman Empire in German lands?",
   "options": [
    "The North German League",
    "The Zollverein",
    "The Rhine Alliance",
    "The German Confederation"
   ],
   "answerIndex": 3
  },
  {
   "question": "Whose escape from Elba interrupted the proceedings in 1815?",
   "options": [
    "Napoleon's",
    "Louis XVIII's",
    "Wellington's",
    "Metternich's"
   ],
   "answerIndex": 0
  },
  {
   "question": "Whose permanent neutrality was guaranteed in 1815?",
   "options": [
    "Belgium's",
    "Greece's",
    "Switzerland's",
    "Sweden's"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which years did the Congress take place?",
   "options": [
    "1814 to 1815",
    "1848 to 1849",
    "1830 to 1831",
    "1804 to 1805"
   ],
   "answerIndex": 0
  }
 ],
 "philadelphia": [
  {
   "question": "Which document was adopted in Philadelphia on 4 July 1776?",
   "options": [
    "The Articles of Confederation",
    "The Constitution",
    "The Declaration of Independence",
    "The Bill of Rights"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who was the principal author of the Declaration?",
   "options": [
    "Thomas Jefferson",
    "Alexander Hamilton",
    "George Washington",
    "John Adams"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which building was it adopted?",
   "options": [
    "Independence Hall",
    "Faneuil Hall",
    "Carpenters' Hall",
    "The Capitol"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year was the US Constitution drafted?",
   "options": [
    "1776",
    "1783",
    "1791",
    "1787"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who presided over the Constitutional Convention?",
   "options": [
    "George Washington",
    "Thomas Paine",
    "Benjamin Franklin",
    "James Madison"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which cracked bell is a symbol of American liberty?",
   "options": [
    "The Patriot Bell",
    "The Freedom Bell",
    "The Union Bell",
    "The Liberty Bell"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which body met in Philadelphia in 1776?",
   "options": [
    "The Virginia Convention",
    "The Federal Senate",
    "The Stamp Act Congress",
    "The Second Continental Congress"
   ],
   "answerIndex": 3
  },
  {
   "question": "How many original states signed on to the Declaration's cause?",
   "options": [
    "Nine",
    "Twenty",
    "Fifty",
    "Thirteen"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Philadelphia polymath sat on the Committee of Five?",
   "options": [
    "Benjamin Franklin",
    "Samuel Adams",
    "John Jay",
    "Patrick Henry"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which compromise created a House by population and a Senate with equal votes?",
   "options": [
    "The Compromise of 1850",
    "The Three-Fifths Compromise",
    "The Connecticut Compromise",
    "The Missouri Compromise"
   ],
   "answerIndex": 2
  }
 ],
 "gettysburg": [
  {
   "question": "Which Confederate general led the army at Gettysburg?",
   "options": [
    "Jefferson Davis",
    "Stonewall Jackson",
    "Ulysses S. Grant",
    "Robert E. Lee"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who commanded the Union Army of the Potomac there?",
   "options": [
    "Ambrose Burnside",
    "Joseph Hooker",
    "George McClellan",
    "George Meade"
   ],
   "answerIndex": 3
  },
  {
   "question": "What name is given to the ridge where Union forces held a fishhook-shaped line?",
   "options": [
    "Missionary Ridge",
    "Seminary Ridge",
    "Cemetery Ridge",
    "Marye's Heights"
   ],
   "answerIndex": 2
  },
  {
   "question": "How many days did the battle last?",
   "options": [
    "Ten",
    "Seven",
    "Three",
    "One"
   ],
   "answerIndex": 2
  },
  {
   "question": "What was the failed Confederate assault of 3 July called?",
   "options": [
    "Marye's Heights",
    "Burnside's Bridge",
    "The Sunken Road",
    "Pickett's Charge"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who delivered the Gettysburg Address in November 1863?",
   "options": [
    "Edward Everett",
    "Ulysses S. Grant",
    "Abraham Lincoln",
    "Frederick Douglass"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which hill did Colonel Joshua Chamberlain's regiment hold?",
   "options": [
    "Little Round Top",
    "Cemetery Ridge",
    "Missionary Ridge",
    "Culp's Hill"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Union regiment under Chamberlain defended that hill?",
   "options": [
    "The 20th Maine",
    "The 7th New York",
    "The 54th Massachusetts",
    "The 1st Minnesota"
   ],
   "answerIndex": 0
  },
  {
   "question": "Roughly how many casualties did the battle cause in total?",
   "options": [
    "About 500,000",
    "About 50,000",
    "About 5,000",
    "About 500"
   ],
   "answerIndex": 1
  },
  {
   "question": "Why is Gettysburg described as a 'turning point'?",
   "options": [
    "The war ended the next day",
    "The South gained Washington",
    "It ended slavery by treaty",
    "Lee's invasion of the North was turned back"
   ],
   "answerIndex": 3
  }
 ],
 "washington-dc": [
  {
   "question": "Who delivered the 'I Have a Dream' speech in 1963?",
   "options": [
    "Malcolm X",
    "John Lewis",
    "Medgar Evers",
    "Martin Luther King Jr."
   ],
   "answerIndex": 3
  },
  {
   "question": "At which memorial did he speak?",
   "options": [
    "The Lincoln Memorial",
    "The Capitol steps",
    "The Washington Monument",
    "The Jefferson Memorial"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the event officially called?",
   "options": [
    "The Poor People's Campaign",
    "The Freedom Ride",
    "The March on Washington for Jobs and Freedom",
    "The Selma Walk"
   ],
   "answerIndex": 2
  },
  {
   "question": "Roughly how many people attended?",
   "options": [
    "About 250,000",
    "About 2.5 million",
    "About 25,000",
    "About 2,500"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which president was in office during the march?",
   "options": [
    "Dwight Eisenhower",
    "John F. Kennedy",
    "Richard Nixon",
    "Lyndon B. Johnson"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1964 law outlawed discrimination in public places and employment?",
   "options": [
    "The Voting Rights Act",
    "The Emancipation Act",
    "The Civil Rights Act",
    "The Fair Housing Act"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which year was the Voting Rights Act passed?",
   "options": [
    "1971",
    "1957",
    "1965",
    "1954"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who was the chief organiser of the march?",
   "options": [
    "Thurgood Marshall",
    "Stokely Carmichael",
    "Bayard Rustin",
    "Ralph Abernathy"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which long water feature did the crowd gather along?",
   "options": [
    "The Potomac Falls",
    "The Tidal Basin",
    "The Reflecting Pool",
    "The Capitol Fountain"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which gospel singer urged King to 'tell them about the dream'?",
   "options": [
    "Ella Fitzgerald",
    "Aretha Franklin",
    "Billie Holiday",
    "Mahalia Jackson"
   ],
   "answerIndex": 3
  }
 ],
 "hiroshima": [
  {
   "question": "On which date was Hiroshima struck by an atomic bomb?",
   "options": [
    "2 September 1945",
    "7 December 1941",
    "9 August 1945",
    "6 August 1945"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the name of the B-29 bomber that dropped the bomb?",
   "options": [
    "Bockscar",
    "Memphis Belle",
    "Spirit of St. Louis",
    "Enola Gay"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the bomb called?",
   "options": [
    "Trinity",
    "Castle Bravo",
    "Little Boy",
    "Fat Man"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which physicist directed the Los Alamos laboratory that built the bomb?",
   "options": [
    "Enrico Fermi",
    "J. Robert Oppenheimer",
    "Albert Einstein",
    "Edward Teller"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which wartime research programme developed the bomb?",
   "options": [
    "Project Paperclip",
    "The Manhattan Project",
    "Operation Overlord",
    "The Apollo Programme"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which ruined building is preserved as a peace memorial?",
   "options": [
    "Hiroshima Castle",
    "Osaka Tower",
    "The Genbaku Dome",
    "Itsukushima Shrine"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which shrine with a famous 'floating' torii gate lies near Hiroshima?",
   "options": [
    "Itsukushima",
    "Fushimi Inari",
    "Meiji Jingu",
    "Toshogu"
   ],
   "answerIndex": 0
  },
  {
   "question": "On which main island of Japan is Hiroshima?",
   "options": [
    "Hokkaido",
    "Kyushu",
    "Shikoku",
    "Honshu"
   ],
   "answerIndex": 3
  },
  {
   "question": "Where is the annual 6 August peace ceremony held?",
   "options": [
    "Peace Memorial Park",
    "Nara Park",
    "Ueno Park",
    "Yoyogi Park"
   ],
   "answerIndex": 0
  },
  {
   "question": "Whose thousand paper cranes became a symbol of peace?",
   "options": [
    "Ruby Bridges",
    "Sophie Scholl",
    "Sadako Sasaki",
    "Anne Frank"
   ],
   "answerIndex": 2
  }
 ],
 "nagasaki": [
  {
   "question": "On which date was Nagasaki struck by an atomic bomb?",
   "options": [
    "9 August 1945",
    "6 August 1945",
    "2 September 1945",
    "15 August 1945"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the Nagasaki bomb called?",
   "options": [
    "Ivy Mike",
    "Little Boy",
    "Fat Man",
    "Trinity"
   ],
   "answerIndex": 2
  },
  {
   "question": "What was the name of the aircraft that dropped it?",
   "options": [
    "The Great Artiste",
    "Bockscar",
    "Enola Gay",
    "Memphis Belle"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which city was that day's primary target before cloud cover intervened?",
   "options": [
    "Kyoto",
    "Sapporo",
    "Kokura",
    "Yokohama"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which European nation long traded through Nagasaki harbour?",
   "options": [
    "The Netherlands",
    "Austria",
    "France",
    "Sweden"
   ],
   "answerIndex": 0
  },
  {
   "question": "What was the artificial island trading post in Nagasaki harbour called?",
   "options": [
    "Sado",
    "Okinawa",
    "Dejima",
    "Miyajima"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Nagasaki district's large cathedral was destroyed by the bomb?",
   "options": [
    "Asakusa",
    "Urakami",
    "Shinjuku",
    "Gion"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which emperor announced Japan's surrender on 15 August 1945?",
   "options": [
    "Meiji",
    "Akihito",
    "Taisho",
    "Hirohito"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which group of Christians were executed at Nagasaki in 1597?",
   "options": [
    "The Twelve Apostles",
    "The Forty-Seven Ronin",
    "The Seven Samurai",
    "The Twenty-Six Martyrs"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which of Japan's main islands does Nagasaki lie?",
   "options": [
    "Kyushu",
    "Hokkaido",
    "Honshu",
    "Shikoku"
   ],
   "answerIndex": 0
  }
 ],
 "yalta": [
  {
   "question": "Which three leaders met at the Yalta Conference?",
   "options": [
    "Roosevelt, de Gaulle and Mao",
    "Truman, Attlee and Stalin",
    "Churchill, Hitler and Mussolini",
    "Roosevelt, Churchill and Stalin"
   ],
   "answerIndex": 3
  },
  {
   "question": "Yalta lies on which peninsula?",
   "options": [
    "Jutland",
    "Crimea",
    "Kamchatka",
    "Iberia"
   ],
   "answerIndex": 1
  },
  {
   "question": "What did the leaders agree to do with defeated Germany?",
   "options": [
    "Leave it unoccupied",
    "Divide it into occupation zones",
    "Give it to France",
    "Make it a neutral kingdom"
   ],
   "answerIndex": 1
  },
  {
   "question": "What did Stalin promise regarding Japan?",
   "options": [
    "To supply Japan with oil",
    "To join the war against Japan after Germany fell",
    "To stay neutral forever",
    "To sign a peace with Japan"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was the conference's code name?",
   "options": [
    "Overlord",
    "Trident",
    "Eureka",
    "Argonaut"
   ],
   "answerIndex": 3
  },
  {
   "question": "Whose postwar borders and government were fiercely debated?",
   "options": [
    "Greece's",
    "Norway's",
    "Portugal's",
    "Poland's"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which new international body did the leaders discuss founding?",
   "options": [
    "The European Union",
    "The World Bank",
    "The United Nations",
    "The League of Nations"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which palace hosted most of the sessions?",
   "options": [
    "Cecilienhof",
    "Livadia Palace",
    "Peterhof",
    "Winter Palace"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which month of 1945 did the conference take place?",
   "options": [
    "February",
    "November",
    "April",
    "July"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did the Declaration on Liberated Europe promise?",
   "options": [
    "Reparations for Britain only",
    "Free elections in liberated countries",
    "A ban on all alliances",
    "A single European army"
   ],
   "answerIndex": 1
  }
 ],
 "potsdam": [
  {
   "question": "Which US president attended Potsdam as a newcomer to the office?",
   "options": [
    "Franklin D. Roosevelt",
    "Dwight Eisenhower",
    "Harry S. Truman",
    "Herbert Hoover"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which British leader replaced Churchill partway through?",
   "options": [
    "Neville Chamberlain",
    "Harold Macmillan",
    "Anthony Eden",
    "Clement Attlee"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Soviet leader attended?",
   "options": [
    "Joseph Stalin",
    "Georgy Zhukov",
    "Nikita Khrushchev",
    "Vyacheslav Molotov"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which warning demanded Japan's unconditional surrender?",
   "options": [
    "The Potsdam Declaration",
    "The Atlantic Charter",
    "The Tehran Accord",
    "The Kellogg Pact"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which palace hosted the talks?",
   "options": [
    "Cecilienhof",
    "Schönbrunn",
    "Sanssouci",
    "Charlottenburg"
   ],
   "answerIndex": 0
  },
  {
   "question": "Into how many occupation zones was Germany divided?",
   "options": [
    "Six",
    "Three",
    "Four",
    "Two"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which line became Poland's new western border?",
   "options": [
    "The Siegfried line",
    "The Oder-Neisse line",
    "The Curzon line",
    "The Maginot line"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which of these was one of the 'Four Ds' for Germany?",
   "options": [
    "Devaluation",
    "Denazification",
    "Decolonisation",
    "Deregulation"
   ],
   "answerIndex": 1
  },
  {
   "question": "What did Truman hint at to Stalin during the talks?",
   "options": [
    "A new trade treaty",
    "A planned invasion of Britain",
    "A powerful new weapon",
    "A space programme"
   ],
   "answerIndex": 2
  },
  {
   "question": "Potsdam lies next to which major city?",
   "options": [
    "Munich",
    "Dresden",
    "Hamburg",
    "Berlin"
   ],
   "answerIndex": 3
  }
 ],
 "sarajevo": [
  {
   "question": "Who was assassinated in Sarajevo on 28 June 1914?",
   "options": [
    "Tsar Nicholas II",
    "King Peter I",
    "Archduke Franz Ferdinand",
    "Kaiser Wilhelm II"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who fired the fatal shots?",
   "options": [
    "Milan Obrenović",
    "Dragutin Dimitrijević",
    "Gavrilo Princip",
    "Nikola Pašić"
   ],
   "answerIndex": 2
  },
  {
   "question": "Franz Ferdinand was heir to which throne?",
   "options": [
    "The Ottoman Empire",
    "Austria-Hungary",
    "Germany",
    "Russia"
   ],
   "answerIndex": 1
  },
  {
   "question": "Near which bridge did the assassination take place?",
   "options": [
    "The Stari Most",
    "The Latin Bridge",
    "The Ponte Vecchio",
    "The Drina Bridge"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which date did Austria-Hungary declare war on Serbia?",
   "options": [
    "28 July 1914",
    "28 June 1914",
    "1 August 1914",
    "4 August 1914"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which tangled web of pacts helped turn the crisis into a world war?",
   "options": [
    "The Hanseatic League",
    "The system of alliances",
    "The Congress system",
    "The Treaty of Westphalia"
   ],
   "answerIndex": 1
  },
  {
   "question": "Who was killed alongside the archduke?",
   "options": [
    "His sister Maria",
    "His wife Sophie",
    "His brother Karl",
    "His driver Leopold"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which territory had Austria-Hungary annexed in 1908?",
   "options": [
    "Bosnia and Herzegovina",
    "Macedonia",
    "Albania",
    "Montenegro"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which long siege of Sarajevo took place from 1992 to 1996?",
   "options": [
    "The Siege of Orleans",
    "The Siege of Vienna",
    "The Siege of Sarajevo",
    "The Siege of Malta"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Winter Olympics did Sarajevo host?",
   "options": [
    "1984",
    "2002",
    "1972",
    "1992"
   ],
   "answerIndex": 0
  }
 ],
 "normandy": [
  {
   "question": "What was the code name of the Allied invasion of Normandy?",
   "options": [
    "Operation Market Garden",
    "Operation Barbarossa",
    "Operation Torch",
    "Operation Overlord"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which date did the landings begin?",
   "options": [
    "11 November 1918",
    "7 December 1941",
    "8 May 1945",
    "6 June 1944"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who was the Supreme Allied Commander?",
   "options": [
    "Dwight D. Eisenhower",
    "George Patton",
    "Bernard Montgomery",
    "Douglas MacArthur"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which beach was the bloodiest for American troops?",
   "options": [
    "Omaha",
    "Juno",
    "Sword",
    "Gold"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which of these was a D-Day beach code name?",
   "options": [
    "Delta",
    "Alpha",
    "Zulu",
    "Juno"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which German field marshal strengthened the Atlantic Wall?",
   "options": [
    "Heinz Guderian",
    "Erwin Rommel",
    "Erich von Manstein",
    "Walter Model"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which deception plan pointed the Germans towards Calais?",
   "options": [
    "Operation Dynamo",
    "Operation Anvil",
    "Operation Mincemeat",
    "Operation Fortitude"
   ],
   "answerIndex": 3
  },
  {
   "question": "What were the prefabricated floating harbours called?",
   "options": [
    "Mulberry harbours",
    "Atlantic docks",
    "Trident piers",
    "Neptune ports"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how many Allied troops landed on the first day?",
   "options": [
    "About 560,000",
    "About 156,000",
    "About 1.5 million",
    "About 15,000"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which US airborne divisions dropped behind the beaches?",
   "options": [
    "The 1st and 3rd",
    "The 5th and 9th",
    "The 82nd and 101st",
    "The 10th and 25th"
   ],
   "answerIndex": 2
  }
 ],
 "waterloo": [
  {
   "question": "Which British commander defeated Napoleon at Waterloo?",
   "options": [
    "The Duke of Marlborough",
    "The Duke of Wellington",
    "Lord Nelson",
    "Lord Raglan"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Prussian marshal arrived to support him?",
   "options": [
    "Karl von Clausewitz",
    "Gebhard von Blücher",
    "Helmuth von Moltke",
    "Paul von Hindenburg"
   ],
   "answerIndex": 1
  },
  {
   "question": "Where was Napoleon exiled after Waterloo?",
   "options": [
    "Malta",
    "Elba",
    "Saint Helena",
    "Corsica"
   ],
   "answerIndex": 2
  },
  {
   "question": "How long did Napoleon's return to power last?",
   "options": [
    "About ten years",
    "About one week",
    "About a year",
    "About 100 days"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which elite French troops made the last failed attack?",
   "options": [
    "The Mamluks",
    "The Imperial Guard",
    "The Foreign Legion",
    "The Swiss Guard"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which French marshal led the great cavalry charges?",
   "options": [
    "Jean Lannes",
    "Louis Davout",
    "Joachim Murat",
    "Michel Ney"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which fortified farm was bitterly defended on the allied right?",
   "options": [
    "Plancenoit",
    "La Haye Sainte only",
    "Quatre Bras",
    "Hougoumont"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which day of the week was the battle fought?",
   "options": [
    "Friday",
    "Sunday",
    "Wednesday",
    "Monday"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which alliance defeated Napoleon in 1815?",
   "options": [
    "The Triple Entente",
    "The Seventh Coalition",
    "The Delian League",
    "The Holy League"
   ],
   "answerIndex": 1
  },
  {
   "question": "What does 'meeting your Waterloo' mean today?",
   "options": [
    "Suffering a decisive defeat",
    "Winning a great victory",
    "Taking a long holiday",
    "Making a new friend"
   ],
   "answerIndex": 0
  }
 ],
 "trafalgar": [
  {
   "question": "Which admiral led the British fleet at Trafalgar?",
   "options": [
    "Lord Anson",
    "Edward Hawke",
    "Francis Drake",
    "Horatio Nelson"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was Nelson's flagship?",
   "options": [
    "HMS Dreadnought",
    "HMS Victory",
    "HMS Beagle",
    "HMS Bounty"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which two navies fought the British?",
   "options": [
    "The Dutch and Danish",
    "The Portuguese and Italian",
    "The French and Spanish",
    "The Russian and Swedish"
   ],
   "answerIndex": 2
  },
  {
   "question": "What did Nelson's famous signal say every man would do?",
   "options": [
    "Drink",
    "Surrender",
    "His duty",
    "Retreat"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which French admiral commanded the combined fleet?",
   "options": [
    "Michel Ney",
    "Napoleon Bonaparte",
    "Jean Lannes",
    "Pierre-Charles Villeneuve"
   ],
   "answerIndex": 3
  },
  {
   "question": "How did Nelson die?",
   "options": [
    "Drowned at sea",
    "Executed after capture",
    "Shot by a sniper during the battle",
    "Died of fever before it began"
   ],
   "answerIndex": 2
  },
  {
   "question": "Cape Trafalgar lies off which Spanish region?",
   "options": [
    "Catalonia",
    "Andalusia",
    "The Basque Country",
    "Galicia"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which of Napoleon's plans did the victory end?",
   "options": [
    "A siege of Gibraltar by land",
    "An invasion of Britain",
    "A conquest of Egypt",
    "A march on Moscow"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which London square is named after the battle?",
   "options": [
    "Leicester Square",
    "Berkeley Square",
    "Sloane Square",
    "Trafalgar Square"
   ],
   "answerIndex": 3
  },
  {
   "question": "What tactic did Nelson use?",
   "options": [
    "Sailing in two columns straight at the enemy line",
    "Boarding from the rear only",
    "A line-ahead broadside duel",
    "Night attacks with fire ships"
   ],
   "answerIndex": 0
  }
 ],
 "westphalia": [
  {
   "question": "Which war ended with the Peace of Westphalia?",
   "options": [
    "The War of the Roses",
    "The Thirty Years' War",
    "The Seven Years' War",
    "The Hundred Years' War"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which two cities hosted the negotiations?",
   "options": [
    "Osnabrück and Münster",
    "Vienna and Prague",
    "Berlin and Munich",
    "Hamburg and Bremen"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which principle of the international order is linked to Westphalia?",
   "options": [
    "State sovereignty",
    "Universal empire",
    "Divine right of emperors",
    "Rule by the papacy"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which empire was weakened by the settlement?",
   "options": [
    "The Mughal Empire",
    "The Ottoman Empire",
    "The British Empire",
    "The Holy Roman Empire"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Protestant branch gained recognition beside Catholicism and Lutheranism?",
   "options": [
    "Anabaptism",
    "Calvinism",
    "Anglicanism",
    "Methodism"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which ruling house lost influence?",
   "options": [
    "The Bourbons",
    "The Romanovs",
    "The Habsburgs",
    "The Tudors"
   ],
   "answerIndex": 2
  },
  {
   "question": "Whose independence from Spain was formally recognised?",
   "options": [
    "Portugal",
    "Catalonia",
    "Bavaria",
    "The Dutch Republic"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which northern kingdom gained Baltic territory?",
   "options": [
    "Poland",
    "Denmark",
    "Norway",
    "Sweden"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which 1555 peace had set 'whose realm, his religion'?",
   "options": [
    "The Peace of Augsburg",
    "The Peace of Nantes",
    "The Peace of Paris",
    "The Peace of Utrecht"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year was the settlement signed?",
   "options": [
    "1618",
    "1789",
    "1713",
    "1648"
   ],
   "answerIndex": 3
  }
 ],
 "tehran": [
  {
   "question": "Which Allied leader celebrated his 69th birthday at the conference?",
   "options": [
    "Franklin D. Roosevelt",
    "Joseph Stalin",
    "Winston Churchill",
    "Charles de Gaulle"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which major plan did the Allies agree to at the conference?",
   "options": [
    "Invading Switzerland",
    "Dividing Japan",
    "Founding NATO",
    "Opening a second front in western Europe"
   ],
   "answerIndex": 3
  },
  {
   "question": "Where did Roosevelt stay during the conference?",
   "options": [
    "A hotel in the bazaar",
    "The British embassy",
    "The Soviet embassy",
    "A royal palace"
   ],
   "answerIndex": 2
  },
  {
   "question": "Whose independence and territorial integrity did the leaders affirm?",
   "options": [
    "Iran's",
    "Iraq's",
    "Turkey's",
    "Egypt's"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which shah ruled Iran at the time?",
   "options": [
    "Fath-Ali Shah",
    "Reza Shah Pahlavi",
    "Nader Shah",
    "Mohammad Reza Pahlavi"
   ],
   "answerIndex": 3
  },
  {
   "question": "What was the code name of the Tehran conference?",
   "options": [
    "Overlord",
    "Eureka",
    "Argonaut",
    "Sextant"
   ],
   "answerIndex": 1
  },
  {
   "question": "What did Stalin promise about the war with Japan?",
   "options": [
    "To sign a separate peace",
    "To join it once Germany was beaten",
    "To fight it immediately",
    "To stay out of it"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which joint occupation of Iran had occurred in 1941?",
   "options": [
    "The German occupation",
    "The Ottoman invasion",
    "The Anglo-Soviet invasion",
    "The American invasion"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which mountain range lies north of Tehran?",
   "options": [
    "The Taurus",
    "The Alborz",
    "The Zagros",
    "The Hindu Kush"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1979 upheaval later transformed Iran's government?",
   "options": [
    "The Iranian Revolution",
    "The Green Revolution",
    "The White Revolution",
    "The Constitutional Revolution"
   ],
   "answerIndex": 0
  }
 ],
 "amritsar": [
  {
   "question": "What was the massacre in Amritsar on 13 April 1919 called?",
   "options": [
    "The Partition riots",
    "The Jallianwala Bagh massacre",
    "The Cawnpore massacre",
    "The Salt March"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which British general ordered troops to open fire?",
   "options": [
    "Reginald Dyer",
    "Lord Mountbatten",
    "Charles Napier",
    "Robert Clive"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which spring festival had drawn the crowd?",
   "options": [
    "Baisakhi",
    "Diwali",
    "Holi",
    "Eid"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Sikh holy site is in Amritsar?",
   "options": [
    "The Golden Temple",
    "The Red Fort",
    "The Lotus Temple",
    "The Qutb Minar"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which repressive 1919 law had sparked protests?",
   "options": [
    "The Salt Act",
    "The Vernacular Press Act",
    "The Rowlatt Act",
    "The Stamp Act"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Nobel laureate renounced his knighthood in protest?",
   "options": [
    "Jawaharlal Nehru",
    "Amartya Sen",
    "C. V. Raman",
    "Rabindranath Tagore"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Punjab lieutenant-governor defended the action?",
   "options": [
    "Lord Chelmsford",
    "Lord Curzon",
    "Lord Irwin",
    "Michael O'Dwyer"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who killed O'Dwyer in London in 1940?",
   "options": [
    "Bhagat Singh",
    "Udham Singh",
    "Sukhdev Thapar",
    "Chandrashekhar Azad"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Gandhi-led campaign followed in 1920?",
   "options": [
    "The Swadeshi Movement",
    "The Champaran Satyagraha",
    "The Non-Cooperation Movement",
    "The Quit India Movement"
   ],
   "answerIndex": 2
  },
  {
   "question": "Why was the loss of life so high?",
   "options": [
    "A stampede at the gates",
    "The crowd was trapped in an enclosed garden with few exits",
    "A flood from the river",
    "A fire in a nearby market"
   ],
   "answerIndex": 1
  }
 ],
 "dandi": [
  {
   "question": "Who led the 1930 march to Dandi?",
   "options": [
    "Mahatma Gandhi",
    "Subhas Chandra Bose",
    "Vallabhbhai Patel",
    "Bal Gangadhar Tilak"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which British levy was the march protesting?",
   "options": [
    "The window tax",
    "The poll tax",
    "The salt tax",
    "The income tax"
   ],
   "answerIndex": 2
  },
  {
   "question": "Roughly how far did the marchers walk?",
   "options": [
    "About 90 kilometres",
    "About 3,900 kilometres",
    "About 390 kilometres",
    "About 39 kilometres"
   ],
   "answerIndex": 2
  },
  {
   "question": "From which ashram did the march begin?",
   "options": [
    "Sevagram Ashram",
    "Sabarmati Ashram",
    "Tolstoy Farm",
    "Phoenix Settlement"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which coast did Gandhi make salt at the end of the march?",
   "options": [
    "The Arabian Sea coast",
    "The Bay of Bengal coast",
    "The Persian Gulf coast",
    "The Red Sea coast"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which wider campaign did the march launch?",
   "options": [
    "The Civil Disobedience Movement",
    "The Non-Cooperation Movement",
    "The Quit India Movement",
    "The Swadeshi Movement"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Viceroy of India faced the movement?",
   "options": [
    "Lord Dalhousie",
    "Lord Curzon",
    "Lord Irwin",
    "Lord Mountbatten"
   ],
   "answerIndex": 2
  },
  {
   "question": "About how many followers set out with Gandhi?",
   "options": [
    "About 78",
    "About 7,800",
    "About 780",
    "About 7"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which woman poet led the raid on the Dharasana Salt Works?",
   "options": [
    "Annie Besant",
    "Sarojini Naidu",
    "Kasturba Gandhi",
    "Indira Gandhi"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1931 agreement paused the civil disobedience campaign?",
   "options": [
    "The Cripps Proposal",
    "The Gandhi-Irwin Pact",
    "The Lucknow Pact",
    "The Poona Pact"
   ],
   "answerIndex": 1
  }
 ],
 "soweto": [
  {
   "question": "What policy change sparked the 1976 Soweto uprising?",
   "options": [
    "A rise in bus fares",
    "A ban on trade unions",
    "Forcing Afrikaans as a language of teaching",
    "Closing all township schools"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which system of racial segregation did South Africa enforce at the time?",
   "options": [
    "Feudalism",
    "Colonialism",
    "Apartheid",
    "Federalism"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which 12-year-old's death became an iconic symbol of the uprising?",
   "options": [
    "Hector Pieterson",
    "Chris Hani",
    "Steve Biko",
    "Walter Sisulu"
   ],
   "answerIndex": 0
  },
  {
   "question": "What is 16 June now commemorated as in South Africa?",
   "options": [
    "Youth Day",
    "Freedom Day",
    "Reconciliation Day",
    "Heritage Day"
   ],
   "answerIndex": 0
  },
  {
   "question": "What does the name 'Soweto' stand for?",
   "options": [
    "Southern Workers' Towns",
    "Southern Welfare Towns",
    "South West Territories",
    "South Western Townships"
   ],
   "answerIndex": 3
  },
  {
   "question": "Vilakazi Street was home to Nelson Mandela and which other Nobel Peace laureate?",
   "options": [
    "F. W. de Klerk",
    "Kofi Annan",
    "Albert Luthuli",
    "Desmond Tutu"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which philosophy, associated with Steve Biko, inspired many students?",
   "options": [
    "Pan-Africanism",
    "Négritude",
    "Black Consciousness",
    "Ubuntu socialism"
   ],
   "answerIndex": 2
  },
  {
   "question": "Soweto is part of the area around which city?",
   "options": [
    "Johannesburg",
    "Pretoria",
    "Durban",
    "Cape Town"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year did South Africa hold its first democratic elections?",
   "options": [
    "2001",
    "1976",
    "1990",
    "1994"
   ],
   "answerIndex": 3
  },
  {
   "question": "Roughly how many students took part in the march?",
   "options": [
    "100,000 to 200,000",
    "100 to 200",
    "About a million",
    "10,000 to 20,000"
   ],
   "answerIndex": 3
  }
 ],
 "cape-town": [
  {
   "question": "Which famous prisoner spent 18 years on Robben Island?",
   "options": [
    "Steve Biko",
    "Desmond Tutu",
    "Oliver Tambo",
    "Nelson Mandela"
   ],
   "answerIndex": 3
  },
  {
   "question": "At which trial was Mandela sentenced to life in 1964?",
   "options": [
    "The Treason Trial",
    "The Rivonia Trial",
    "The Nuremberg Trial",
    "The Scopes Trial"
   ],
   "answerIndex": 1
  },
  {
   "question": "In total, about how many years did Mandela spend in prison?",
   "options": [
    "7",
    "27",
    "50",
    "12"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which table-topped mountain towers over Cape Town?",
   "options": [
    "Table Mountain",
    "Mount Kilimanjaro",
    "Drakensberg",
    "Lion's Head"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which two uses has Robben Island had over the centuries?",
   "options": [
    "A leper colony and a prison",
    "A gold mine and a fort",
    "A royal palace and a mint",
    "A university and a harbour"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which company founded a supply station at the Cape in 1652?",
   "options": [
    "The Royal Niger Company",
    "The Dutch East India Company",
    "The Hudson's Bay Company",
    "The British East India Company"
   ],
   "answerIndex": 1
  },
  {
   "question": "Mandela shared the 1993 Nobel Peace Prize with which leader?",
   "options": [
    "P. W. Botha",
    "Jan Smuts",
    "F. W. de Klerk",
    "Thabo Mbeki"
   ],
   "answerIndex": 2
  },
  {
   "question": "Of which political movement was Mandela a leader?",
   "options": [
    "The Pan Africanist Congress",
    "The African National Congress",
    "The National Party",
    "The Inkatha Party"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which cape at the peninsula, first called the Cape of Storms, is nearby?",
   "options": [
    "Cape Agulhas",
    "The Cape of Good Hope",
    "Cape Finisterre",
    "Cape Horn"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which year was Mandela released from prison?",
   "options": [
    "1964",
    "1990",
    "1976",
    "1999"
   ],
   "answerIndex": 1
  }
 ],
 "havana": [
  {
   "question": "Which revolutionary leader took power in Cuba in January 1959?",
   "options": [
    "José Martí",
    "Simón Bolívar",
    "Fidel Castro",
    "Che Guevara"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which dictator was overthrown?",
   "options": [
    "Fulgencio Batista",
    "Rafael Trujillo",
    "Anastasio Somoza",
    "Augusto Pinochet"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Argentine-born doctor fought alongside Castro?",
   "options": [
    "Camilo Cienfuegos",
    "Che Guevara",
    "Hugo Chávez",
    "Raúl Castro"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was Castro's guerrilla movement called?",
   "options": [
    "The Zapatistas",
    "The Sandinistas",
    "The Shining Path",
    "The 26th of July Movement"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which mountain range served as the rebels' base?",
   "options": [
    "The Sierra Nevada",
    "The Rockies",
    "The Andes",
    "The Sierra Maestra"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which failed 1961 invasion was backed by the United States?",
   "options": [
    "The Dominican Intervention",
    "Operation Just Cause",
    "The Panama Landing",
    "The Bay of Pigs"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which 1962 standoff over nuclear missiles brought the world close to war?",
   "options": [
    "The Suez Crisis",
    "The Cuban Missile Crisis",
    "The Berlin Crisis",
    "The Gulf of Tonkin Incident"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Soviet leader placed missiles in Cuba?",
   "options": [
    "Mikhail Gorbachev",
    "Joseph Stalin",
    "Nikita Khrushchev",
    "Leonid Brezhnev"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which US naval base remains on the island?",
   "options": [
    "Guantánamo Bay",
    "Key West",
    "Subic Bay",
    "Pearl Harbor"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which part of Havana is a UNESCO World Heritage Site?",
   "options": [
    "Old Havana",
    "Marianao",
    "Vedado",
    "Miramar"
   ],
   "answerIndex": 0
  }
 ],
 "isfahan": [
  {
   "question": "Which shah moved the Safavid capital to Isfahan in 1598?",
   "options": [
    "Abbas I",
    "Tahmasp I",
    "Nader Shah",
    "Ismail I"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which dynasty ruled Persia from Isfahan then?",
   "options": [
    "The Qajars",
    "The Sassanids",
    "The Safavids",
    "The Achaemenids"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is Isfahan's great central plaza called?",
   "options": [
    "Azadi Square",
    "Tahrir Square",
    "Registan Square",
    "Naqsh-e Jahan Square"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which splendid mosque stands on the square's south side?",
   "options": [
    "The Great Mosque of Damascus",
    "The Blue Mosque",
    "Al-Azhar Mosque",
    "The Shah Mosque"
   ],
   "answerIndex": 3
  },
  {
   "question": "What does the proverb 'Isfahan is half the world' praise?",
   "options": [
    "Its size in square miles",
    "Its army",
    "The city's beauty and wealth",
    "Its harvests"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is the six-storey palace on Naqsh-e Jahan Square called?",
   "options": [
    "Chehel Sotoun",
    "Golestan Palace",
    "Niavaran Palace",
    "Ali Qapu"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which bridge is named for its 33 arches?",
   "options": [
    "Si-o-se-pol",
    "Rialto Bridge",
    "Pol-e Sefid",
    "Khaju Bridge"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which neighbouring empire did Abbas I fight over borders?",
   "options": [
    "The Ottoman Empire",
    "The Mughal Empire",
    "The Byzantine Empire",
    "The Russian Empire"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which branch of Islam did the Safavids establish as the state religion?",
   "options": [
    "Sufi Ibadism",
    "Twelver Shia Islam",
    "Ismaili Islam",
    "Sunni Hanafi Islam"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which colours dominate the famed tilework of Isfahan's mosques?",
   "options": [
    "Green and purple",
    "Turquoise and blue",
    "Crimson and gold",
    "Black and white"
   ],
   "answerIndex": 1
  }
 ],
 "samarkand": [
  {
   "question": "Which conqueror made Samarkand his capital in 1370?",
   "options": [
    "Babur",
    "Genghis Khan",
    "Timur",
    "Kublai Khan"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which dynasty did he found?",
   "options": [
    "The Mughals",
    "The Safavids",
    "The Timurids",
    "The Ottomans"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is Samarkand's famed ensemble of three madrasas called?",
   "options": [
    "The Alhambra",
    "The Forbidden City",
    "The Kremlin",
    "The Registan"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Timurid ruler built a great observatory in Samarkand?",
   "options": [
    "Ulugh Beg",
    "Husayn Bayqara",
    "Abu Said",
    "Shah Rukh"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which avenue of blue-tiled mausoleums forms a famous necropolis in Samarkand?",
   "options": [
    "Registan",
    "Shah-i-Zinda",
    "Ark of Bukhara",
    "Gur-e-Amir"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which mausoleum holds Timur's tomb?",
   "options": [
    "Gur-e-Amir",
    "The Mausoleum of Halicarnassus",
    "Humayun's Tomb",
    "The Taj Mahal"
   ],
   "answerIndex": 0
  },
  {
   "question": "By what name did Alexander's Greeks know Samarkand?",
   "options": [
    "Susa",
    "Bactra",
    "Tyre",
    "Maracanda"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which huge mosque bears the name of Timur's wife?",
   "options": [
    "Faisal Mosque",
    "Al-Aqsa Mosque",
    "Bibi-Khanym Mosque",
    "Jama Masjid"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which earlier conqueror destroyed Samarkand in 1220?",
   "options": [
    "Darius I",
    "Genghis Khan",
    "Attila",
    "Alexander the Great"
   ],
   "answerIndex": 1
  },
  {
   "question": "What cultural flowering did Timur's descendants foster in arts and science?",
   "options": [
    "The Hellenistic Revival",
    "The Carolingian Renaissance",
    "The Tang Revival",
    "The Timurid Renaissance"
   ],
   "answerIndex": 3
  }
 ],
 "angkor": [
  {
   "question": "Which empire built Angkor?",
   "options": [
    "The Srivijaya Empire",
    "The Majapahit Empire",
    "The Khmer Empire",
    "The Champa Kingdom"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which temple is the world's largest religious monument?",
   "options": [
    "Wat Arun",
    "Bagan",
    "Borobudur",
    "Angkor Wat"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which king built Angkor Wat?",
   "options": [
    "Suryavarman II",
    "Indravarman I",
    "Jayavarman VII",
    "Yasovarman I"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which king built the walled city of Angkor Thom?",
   "options": [
    "Jayavarman VII",
    "Rajendravarman",
    "Jayavarman II",
    "Suryavarman II"
   ],
   "answerIndex": 0
  },
  {
   "question": "To which Hindu god was Angkor Wat first dedicated?",
   "options": [
    "Shiva",
    "Brahma",
    "Ganesha",
    "Vishnu"
   ],
   "answerIndex": 3
  },
  {
   "question": "What are Angkor's vast reservoirs called?",
   "options": [
    "Cenotes",
    "Ghats",
    "Stupas",
    "Barays"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which great lake supported Angkor's rice farming and fisheries?",
   "options": [
    "Inle Lake",
    "Lake Taal",
    "Tonlé Sap",
    "Lake Toba"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which temple is known for its many smiling stone faces?",
   "options": [
    "Preah Vihear",
    "Banteay Srei",
    "Ta Prohm",
    "The Bayon"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which king is credited with founding the Khmer Empire in 802?",
   "options": [
    "Harshavarman",
    "Udayadityavarman",
    "Jayavarman II",
    "Suryavarman I"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Siamese kingdom sacked Angkor in 1431?",
   "options": [
    "Pagan",
    "Lan Na",
    "Ayutthaya",
    "Sukhothai"
   ],
   "answerIndex": 2
  }
 ],
 "hastings": [
  {
   "question": "Which duke won the Battle of Hastings in 1066?",
   "options": [
    "Harald Hardrada",
    "Harold Godwinson",
    "William of Normandy",
    "Edward the Confessor"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which English king was killed at Hastings?",
   "options": [
    "Cnut",
    "Edmund Ironside",
    "Harold Godwinson",
    "Edward the Confessor"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which embroidered cloth depicts the Norman Conquest?",
   "options": [
    "The Bayeux Tapestry",
    "The Lewis Chessmen",
    "The Domesday Book",
    "The Book of Kells"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Norwegian king did Harold beat at Stamford Bridge shortly before?",
   "options": [
    "Olaf Tryggvason",
    "Cnut",
    "Harald Hardrada",
    "Sweyn Forkbeard"
   ],
   "answerIndex": 2
  },
  {
   "question": "According to tradition, how was King Harold killed?",
   "options": [
    "Poisoned at a feast",
    "By an arrow to the eye",
    "Beheaded in prison",
    "Drowned crossing the Channel"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which nickname did William earn after the victory?",
   "options": [
    "The Lionheart",
    "The Conqueror",
    "The Great",
    "The Bold"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which date was the battle fought?",
   "options": [
    "14 October",
    "1 May",
    "21 June",
    "25 December"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which abbey was founded on the battle site?",
   "options": [
    "Westminster Abbey",
    "Fountains Abbey",
    "Tintern Abbey",
    "Battle Abbey"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which language did the new Norman ruling class speak?",
   "options": [
    "Old Norse",
    "Latin only",
    "Welsh",
    "Norman French"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Norman tactic is said to have broken the English shield wall?",
   "options": [
    "Feigned retreats",
    "Naval bombardment",
    "Poisoned arrows",
    "Night raids"
   ],
   "answerIndex": 0
  }
 ],
 "agincourt": [
  {
   "question": "Which English king won the Battle of Agincourt?",
   "options": [
    "Richard III",
    "Henry VIII",
    "Edward III",
    "Henry V"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which weapon made the English archers so deadly?",
   "options": [
    "The musket",
    "The trebuchet",
    "The longbow",
    "The crossbow"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which long conflict included Agincourt?",
   "options": [
    "The Hundred Years' War",
    "The Thirty Years' War",
    "The Crusades",
    "The Wars of the Roses"
   ],
   "answerIndex": 0
  },
  {
   "question": "What condition of the battlefield hampered the French knights?",
   "options": [
    "Deep, churned-up mud",
    "Thick fog only",
    "Frozen ground",
    "Dense forest"
   ],
   "answerIndex": 0
  },
  {
   "question": "On which saint's day was the battle fought?",
   "options": [
    "Saint Crispin's Day",
    "Saint George's Day",
    "Saint Patrick's Day",
    "Saint Andrew's Day"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which playwright later dramatised Henry V's campaign?",
   "options": [
    "Ben Jonson",
    "Christopher Marlowe",
    "John Webster",
    "William Shakespeare"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which French king ruled in 1415?",
   "options": [
    "Charles VII",
    "Louis XI",
    "Charles VI",
    "Philip IV"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which French port did Henry besiege before Agincourt?",
   "options": [
    "Calais",
    "Bordeaux",
    "Harfleur",
    "Rouen"
   ],
   "answerIndex": 2
  },
  {
   "question": "What protected the English archers from cavalry?",
   "options": [
    "War elephants",
    "Sharpened wooden stakes",
    "Stone walls",
    "A moat"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1420 treaty named Henry heir to the French throne?",
   "options": [
    "The Treaty of Paris",
    "The Treaty of Troyes",
    "The Treaty of Picquigny",
    "The Treaty of Brétigny"
   ],
   "answerIndex": 1
  }
 ],
 "orleans": [
  {
   "question": "Which young woman led French forces to relieve Orléans in 1429?",
   "options": [
    "Marie Antoinette",
    "Joan of Arc",
    "Eleanor of Aquitaine",
    "Catherine de' Medici"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which prince did she support?",
   "options": [
    "Henry VI",
    "Philip of Burgundy",
    "Louis XI",
    "The Dauphin Charles"
   ],
   "answerIndex": 3
  },
  {
   "question": "On what date was the siege lifted?",
   "options": [
    "14 July 1789",
    "25 October 1415",
    "8 May 1429",
    "6 June 1944"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which duchy's soldiers captured Joan in 1430?",
   "options": [
    "Burgundy",
    "Brittany",
    "Aquitaine",
    "Normandy"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which city was Charles crowned later in 1429?",
   "options": [
    "Paris",
    "Reims",
    "Chartres",
    "Lyon"
   ],
   "answerIndex": 1
  },
  {
   "question": "By what nickname is Joan known?",
   "options": [
    "The Maid of Orléans",
    "The Queen of Reims",
    "The Rose of Paris",
    "The Lady of Lyon"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which city was she executed in 1431?",
   "options": [
    "Dijon",
    "Orléans",
    "Rouen",
    "Calais"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which year was she canonised as a saint?",
   "options": [
    "1431",
    "1789",
    "1850",
    "1920"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which fortress guarding the bridge did Joan's troops storm to end the siege?",
   "options": [
    "Les Tourelles",
    "The Bastille",
    "Mont-Saint-Michel",
    "Château Gaillard"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did Joan claim guided her actions?",
   "options": [
    "Dreams of Merlin",
    "Voices of saints",
    "A royal map",
    "A papal letter"
   ],
   "answerIndex": 1
  }
 ],
 "lisbon": [
  {
   "question": "Which prince sponsored early Portuguese voyages of exploration?",
   "options": [
    "Manuel I",
    "Henry the Navigator",
    "John II",
    "Sebastian"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which explorer reached India by sea in 1498?",
   "options": [
    "Bartolomeu Dias",
    "Ferdinand Magellan",
    "Vasco da Gama",
    "Pedro Álvares Cabral"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which light, swift ship type did Portuguese explorers favour?",
   "options": [
    "The longship",
    "The junk",
    "The galleon",
    "The caravel"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Belém tower guarded the Tagus estuary?",
   "options": [
    "The Torre dos Clérigos",
    "The Eiffel Tower",
    "The Giralda",
    "The Belém Tower"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which river does Lisbon sit on?",
   "options": [
    "The Ebro",
    "The Guadiana",
    "The Douro",
    "The Tagus"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which devastating 1755 disaster destroyed much of the city?",
   "options": [
    "A volcanic eruption",
    "A great fire only",
    "A plague outbreak",
    "An earthquake and tsunami"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Portuguese navigator led the voyage that first sailed round the world?",
   "options": [
    "Amerigo Vespucci",
    "Ferdinand Magellan",
    "Christopher Columbus",
    "Jacques Cartier"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which 1494 treaty divided new lands between Portugal and Spain?",
   "options": [
    "The Treaty of Tordesillas",
    "The Treaty of Madrid",
    "The Treaty of Lisbon",
    "The Treaty of Utrecht"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which navigator rounded the Cape of Good Hope in 1488?",
   "options": [
    "Henry the Navigator",
    "Bartolomeu Dias",
    "Vasco da Gama",
    "Afonso de Albuquerque"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which South American land did Portugal claim in 1500?",
   "options": [
    "Chile",
    "Peru",
    "Argentina",
    "Brazil"
   ],
   "answerIndex": 3
  }
 ],
 "seville": [
  {
   "question": "Which royal institution regulated trade with the Americas from Seville?",
   "options": [
    "The Inquisition",
    "The East India Company",
    "The Casa de Contratación",
    "The Hanseatic League"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which river made Seville an inland port?",
   "options": [
    "The Tagus",
    "The Guadalquivir",
    "The Douro",
    "The Ebro"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which explorer's tomb stands inside Seville Cathedral?",
   "options": [
    "Hernán Cortés",
    "Francisco Pizarro",
    "Christopher Columbus",
    "Vasco da Gama"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which tower, once a minaret, rises beside the cathedral?",
   "options": [
    "The Torre del Oro only",
    "The Leaning Tower",
    "The Giralda",
    "Big Ben"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which monarchs backed Columbus's 1492 voyage?",
   "options": [
    "Alfonso X and Eleanor",
    "Charles V and Isabella of Portugal",
    "Ferdinand and Isabella",
    "Philip II and Mary"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which archive in Seville stores records of the Spanish empire in the Americas?",
   "options": [
    "The Escorial Library",
    "The Vatican Archive",
    "The General Archive of the Indies",
    "The Prado Library"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Golden Age painter was born in Seville in 1599?",
   "options": [
    "Francisco Goya",
    "Diego Velázquez",
    "Salvador Dalí",
    "El Greco"
   ],
   "answerIndex": 1
  },
  {
   "question": "What were the convoys carrying American silver to Spain called?",
   "options": [
    "Silk convoys",
    "Treasure fleets",
    "Grain armadas",
    "Spice caravans"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Moorish-influenced royal palace is in Seville?",
   "options": [
    "The Alhambra",
    "The Aljafería",
    "The Escorial",
    "The Real Alcázar"
   ],
   "answerIndex": 3
  },
  {
   "question": "In which year did Columbus first sail west?",
   "options": [
    "1492",
    "1588",
    "1519",
    "1453"
   ],
   "answerIndex": 0
  }
 ],
 "plymouth": [
  {
   "question": "Which ship carried the Pilgrims across the Atlantic in 1620?",
   "options": [
    "The Susan Constant",
    "The Santa María",
    "The Mayflower",
    "The Golden Hind"
   ],
   "answerIndex": 2
  },
  {
   "question": "What agreement did the colonists sign aboard ship?",
   "options": [
    "The Magna Carta",
    "The Declaration of Independence",
    "The Fundamental Orders",
    "The Mayflower Compact"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Wampanoag leader made a peace treaty with the colonists?",
   "options": [
    "Pontiac",
    "Massasoit",
    "Tecumseh",
    "Powhatan"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which English-speaking Native American helped them survive?",
   "options": [
    "Sacagawea",
    "Squanto",
    "Geronimo",
    "Pocahontas"
   ],
   "answerIndex": 1
  },
  {
   "question": "Why did many Pilgrims leave England?",
   "options": [
    "To avoid military service",
    "To search for gold",
    "To worship freely",
    "To escape a plague"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which holiday traces its roots to a 1621 harvest feast?",
   "options": [
    "Labor Day",
    "Independence Day",
    "Thanksgiving",
    "Memorial Day"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which earlier English settlement in Virginia dates to 1607?",
   "options": [
    "Jamestown",
    "Salem",
    "Roanoke",
    "Providence"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how many passengers sailed on the Mayflower?",
   "options": [
    "About 100",
    "About 20",
    "About 1,000",
    "About 10"
   ],
   "answerIndex": 0
  },
  {
   "question": "On which date did the Mayflower set sail from Plymouth, England?",
   "options": [
    "11 November 1620",
    "4 July 1776",
    "12 October 1492",
    "16 September 1620"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which cape did they first sight in North America?",
   "options": [
    "Cape Cod",
    "Cape Canaveral",
    "Cape Fear",
    "Cape Hatteras"
   ],
   "answerIndex": 0
  }
 ],
 "boston": [
  {
   "question": "Which British law's tea monopoly sparked the Boston Tea Party?",
   "options": [
    "The Tea Act",
    "The Quartering Act",
    "The Sugar Act",
    "The Stamp Act"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did the protesters do?",
   "options": [
    "Burned a customs house",
    "Threw tea chests into the harbour",
    "Seized a warship",
    "Blocked the port with wagons"
   ],
   "answerIndex": 1
  },
  {
   "question": "About how many chests of tea were destroyed?",
   "options": [
    "About 34,000",
    "About 340",
    "About 34",
    "About 3,400"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which group organised the protest?",
   "options": [
    "The Sons of Liberty",
    "The Loyalists",
    "The Minutemen",
    "The Green Mountain Boys"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Boston patriot was a leading organiser?",
   "options": [
    "Thomas Gage",
    "Samuel Adams",
    "Ethan Allen",
    "Benedict Arnold"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which slogan summed up colonists' complaint about taxes?",
   "options": [
    "Don't tread on me",
    "United we stand",
    "Give me liberty or give me death",
    "No taxation without representation"
   ],
   "answerIndex": 3
  },
  {
   "question": "What did Britain call its punishing laws that followed?",
   "options": [
    "The Coercive Acts",
    "The Declaratory Act",
    "The Navigation Acts",
    "The Townshend Acts"
   ],
   "answerIndex": 0
  },
  {
   "question": "Whose tea was destroyed?",
   "options": [
    "The Virginia Company's",
    "The Hudson's Bay Company's",
    "The Dutch West India Company's",
    "The British East India Company's"
   ],
   "answerIndex": 3
  },
  {
   "question": "How did many protesters disguise themselves?",
   "options": [
    "As French traders",
    "As British soldiers",
    "As sailors",
    "As Mohawk Indians"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which king ruled Britain at the time?",
   "options": [
    "George II",
    "George III",
    "Charles II",
    "William IV"
   ],
   "answerIndex": 1
  }
 ],
 "lexington": [
  {
   "question": "Which war began with the clashes at Lexington and Concord?",
   "options": [
    "The French and Indian War",
    "The War of 1812",
    "The Civil War",
    "The American Revolutionary War"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which poet called the first shot 'heard round the world'?",
   "options": [
    "Henry Wadsworth Longfellow",
    "Ralph Waldo Emerson",
    "Edgar Allan Poe",
    "Walt Whitman"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which rider warned the countryside that the British were coming?",
   "options": [
    "Ethan Allen",
    "Nathan Hale",
    "John Paul Jones",
    "Paul Revere"
   ],
   "answerIndex": 3
  },
  {
   "question": "What were the quick-response colonial militiamen called?",
   "options": [
    "Rough Riders",
    "Hessians",
    "Minutemen",
    "Redcoats"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which nearby town did the British march on to seize supplies?",
   "options": [
    "Salem",
    "Plymouth",
    "Worcester",
    "Concord"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who commanded British forces in Massachusetts?",
   "options": [
    "General William Howe",
    "Lord Cornwallis",
    "General John Burgoyne",
    "General Thomas Gage"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who commanded the Lexington militia?",
   "options": [
    "Major John Pitcairn",
    "Captain John Parker",
    "General Israel Putnam",
    "Colonel William Prescott"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which colony did the fighting take place?",
   "options": [
    "Pennsylvania",
    "Massachusetts",
    "Virginia",
    "New York"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which date did the battles occur?",
   "options": [
    "16 December 1773",
    "19 April 1775",
    "19 October 1781",
    "4 July 1776"
   ],
   "answerIndex": 1
  },
  {
   "question": "What were British troops trying to seize at Concord?",
   "options": [
    "Colonial military supplies",
    "The Liberty Bell",
    "A printing press",
    "The colonial treasury"
   ],
   "answerIndex": 0
  }
 ],
 "yorktown": [
  {
   "question": "Which British general surrendered at Yorktown?",
   "options": [
    "General Burgoyne",
    "Lord Cornwallis",
    "General Gage",
    "General Howe"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which European ally supplied troops and a fleet at Yorktown?",
   "options": [
    "France",
    "The Dutch Republic",
    "Prussia",
    "Spain only"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which French general led troops alongside Washington?",
   "options": [
    "Montcalm",
    "Rochambeau",
    "Marshal Foch",
    "Napoleon"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which French admiral's fleet blocked the Chesapeake Bay?",
   "options": [
    "Admiral Suffren",
    "Admiral Villeneuve",
    "Comte de Grasse",
    "Admiral Tourville"
   ],
   "answerIndex": 2
  },
  {
   "question": "Yorktown lies on which river?",
   "options": [
    "The York River",
    "The Delaware",
    "The Susquehanna",
    "The Hudson"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which tune is said to have been played at the surrender?",
   "options": [
    "God Save the King",
    "La Marseillaise",
    "Yankee Doodle only",
    "The World Turned Upside Down"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which young French marquis fought at Yorktown?",
   "options": [
    "Talleyrand",
    "Lafayette",
    "Lafitte",
    "Richelieu"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which date did the British surrender?",
   "options": [
    "4 July 1776",
    "19 October 1781",
    "3 September 1783",
    "19 April 1775"
   ],
   "answerIndex": 1
  },
  {
   "question": "Who presented Cornwallis's sword because he claimed illness?",
   "options": [
    "John André",
    "Henry Clinton",
    "Banastre Tarleton",
    "Charles O'Hara"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which British prime minister resigned after the defeat?",
   "options": [
    "Lord North",
    "Robert Walpole",
    "William Pitt the Younger",
    "Lord Palmerston"
   ],
   "answerIndex": 0
  }
 ],
 "vicksburg": [
  {
   "question": "Which Union general led the Vicksburg campaign?",
   "options": [
    "George Meade",
    "George McClellan",
    "William T. Sherman",
    "Ulysses S. Grant"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Confederate general defended the city?",
   "options": [
    "James Longstreet",
    "Braxton Bragg",
    "Robert E. Lee",
    "John C. Pemberton"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which river did Vicksburg overlook?",
   "options": [
    "The Ohio",
    "The Tennessee",
    "The Mississippi",
    "The Potomac"
   ],
   "answerIndex": 2
  },
  {
   "question": "Why was Vicksburg so important?",
   "options": [
    "Holding it gave control of the Mississippi and split the Confederacy",
    "It held the Confederate capital",
    "It guarded Washington",
    "It had the largest cotton mill"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how long did the siege last?",
   "options": [
    "About 4 days",
    "About 4 months",
    "About a year",
    "About 47 days"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which date did Vicksburg surrender?",
   "options": [
    "4 July 1776",
    "1 July 1863",
    "9 April 1865",
    "4 July 1863"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Union admiral's gunboats supported the campaign?",
   "options": [
    "John Dahlgren",
    "David Farragut",
    "David Porter",
    "Raphael Semmes"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Union strategy aimed to squeeze the Confederacy by blockade and river control?",
   "options": [
    "The Anaconda Plan",
    "The Schlieffen Plan",
    "The Cobra Plan",
    "The Marshall Plan"
   ],
   "answerIndex": 0
  },
  {
   "question": "Where did many residents shelter during the shelling?",
   "options": [
    "In stone forts",
    "In hand-dug caves",
    "In church basements only",
    "On riverboats"
   ],
   "answerIndex": 1
  },
  {
   "question": "What finally forced Vicksburg's garrison to surrender?",
   "options": [
    "An epidemic of fever",
    "A lack of gunpowder only",
    "A mutiny among its officers",
    "Starvation and dwindling supplies"
   ],
   "answerIndex": 3
  }
 ],
 "appomattox": [
  {
   "question": "On which date did Lee surrender?",
   "options": [
    "1 January 1863",
    "9 April 1865",
    "4 July 1863",
    "14 April 1865"
   ],
   "answerIndex": 1
  },
  {
   "question": "Whose parlour hosted the surrender?",
   "options": [
    "Ulysses Grant's",
    "Joshua Chamberlain's",
    "Wilmer McLean's",
    "Jefferson Davis's"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which army did Lee surrender?",
   "options": [
    "The Army of Tennessee",
    "The Army of the Potomac",
    "The Army of the Cumberland",
    "The Army of Northern Virginia"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Seneca officer on Grant's staff helped draft the surrender documents?",
   "options": [
    "Philip Sheridan",
    "Ely S. Parker",
    "George Custer",
    "Joshua Chamberlain"
   ],
   "answerIndex": 1
  },
  {
   "question": "What did Grant's generous terms allow Confederate soldiers to do?",
   "options": [
    "Go home with their horses and mules",
    "Cross into Mexico",
    "Keep their rifles",
    "Stay in the army"
   ],
   "answerIndex": 0
  },
  {
   "question": "Who assassinated Lincoln days after the surrender?",
   "options": [
    "John Wilkes Booth",
    "Charles Guiteau",
    "Leon Czolgosz",
    "Lee Harvey Oswald"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which amendment abolished slavery in December 1865?",
   "options": [
    "The Nineteenth",
    "The Fifteenth",
    "The First",
    "The Thirteenth"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Confederate capital had fallen a few days earlier?",
   "options": [
    "Charleston",
    "Richmond",
    "Montgomery",
    "Atlanta"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was the name of Lee's famous horse?",
   "options": [
    "Comanche",
    "Little Sorrel",
    "Cincinnati",
    "Traveller"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which era of rebuilding the South followed the war?",
   "options": [
    "The Great Migration",
    "The Gilded Age",
    "Reconstruction",
    "The Progressive Era"
   ],
   "answerIndex": 2
  }
 ],
 "pearl-harbor": [
  {
   "question": "Which country attacked Pearl Harbor?",
   "options": [
    "Japan",
    "Germany",
    "The Soviet Union",
    "Italy"
   ],
   "answerIndex": 0
  },
  {
   "question": "On which date did the attack take place?",
   "options": [
    "7 December 1941",
    "11 September 2001",
    "6 June 1944",
    "1 September 1939"
   ],
   "answerIndex": 0
  },
  {
   "question": "On which Hawaiian island is Pearl Harbor?",
   "options": [
    "Kauai",
    "Oahu",
    "Maui",
    "Hawaii (the Big Island)"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which president called it 'a date which will live in infamy'?",
   "options": [
    "Herbert Hoover",
    "Woodrow Wilson",
    "Franklin D. Roosevelt",
    "Harry Truman"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which sunken battleship is now a memorial?",
   "options": [
    "USS Constitution",
    "USS Maine",
    "USS Arizona",
    "USS Missouri"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which Japanese admiral planned the attack?",
   "options": [
    "Chuichi Nagumo",
    "Isoroku Yamamoto",
    "Hideki Tojo",
    "Tomoyuki Yamashita"
   ],
   "answerIndex": 1
  },
  {
   "question": "Why did the US aircraft carriers survive?",
   "options": [
    "They were under repair in California",
    "They were at sea",
    "They were hidden in caves",
    "They were already sunk"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which day did Congress declare war on Japan?",
   "options": [
    "8 December 1941",
    "1 January 1942",
    "11 December 1941",
    "7 December 1941"
   ],
   "answerIndex": 0
  },
  {
   "question": "About how many Americans were killed in the attack?",
   "options": [
    "About 24,000",
    "About 2,400",
    "About 240",
    "About 240,000"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which two Axis nations declared war on the US days later?",
   "options": [
    "Spain and Portugal",
    "Hungary and Romania",
    "Germany and Italy",
    "Turkey and Iran"
   ],
   "answerIndex": 2
  }
 ],
 "nanjing": [
  {
   "question": "Which war ended with the Treaty of Nanking in 1842?",
   "options": [
    "The Boxer Rebellion",
    "The Taiping Rebellion",
    "The Sino-Japanese War",
    "The First Opium War"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which later-major port was among five opened to British trade?",
   "options": [
    "Tianjin",
    "Shanghai",
    "Wuhan",
    "Beijing"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which British plenipotentiary signed for Britain?",
   "options": [
    "Lord Elgin",
    "Robert Clive",
    "Lord Macartney",
    "Sir Henry Pottinger"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which Qing emperor reigned at the time?",
   "options": [
    "Daoguang",
    "Guangxu",
    "Kangxi",
    "Qianlong"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which drug fuelled the trade dispute?",
   "options": [
    "Silk",
    "Tea",
    "Opium",
    "Cotton"
   ],
   "answerIndex": 2
  },
  {
   "question": "Roughly how much silver did China pay as indemnity?",
   "options": [
    "210 million silver dollars",
    "2 million silver dollars",
    "21 million silver dollars",
    "2,100 silver dollars"
   ],
   "answerIndex": 2
  },
  {
   "question": "What name do historians give to such lopsided agreements?",
   "options": [
    "Peace charters",
    "Trade compacts",
    "Unequal treaties",
    "Fair accords"
   ],
   "answerIndex": 2
  },
  {
   "question": "Aboard which British warship was the treaty signed?",
   "options": [
    "HMS Beagle",
    "HMS Cornwallis",
    "HMS Bounty",
    "HMS Victory"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Chinese commissioner destroyed British opium stocks in 1839?",
   "options": [
    "Zeng Guofan",
    "Sun Yat-sen",
    "Li Hongzhang",
    "Lin Zexu"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which great river does Nanjing stand?",
   "options": [
    "The Pearl River",
    "The Mekong",
    "The Yangtze",
    "The Yellow River"
   ],
   "answerIndex": 2
  }
 ],
 "hong-kong": [
  {
   "question": "On which date was Hong Kong handed back to China?",
   "options": [
    "12 February 1912",
    "25 December 1941",
    "1 January 1984",
    "1 July 1997"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which country returned Hong Kong to China?",
   "options": [
    "The United Kingdom",
    "Portugal",
    "The Netherlands",
    "France"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which formula described Hong Kong's post-handover status?",
   "options": [
    "One country, two systems",
    "One nation, one law",
    "Two countries, one market",
    "Free port forever"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Chinese leader championed that idea?",
   "options": [
    "Deng Xiaoping",
    "Jiang Zemin",
    "Zhou Enlai",
    "Mao Zedong"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which British prime minister signed the 1984 Joint Declaration?",
   "options": [
    "Tony Blair",
    "Margaret Thatcher",
    "Winston Churchill",
    "Edward Heath"
   ],
   "answerIndex": 1
  },
  {
   "question": "Who was Hong Kong's last British governor?",
   "options": [
    "Murray MacLehose",
    "Mark Young",
    "Chris Patten",
    "David Wilson"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which island was ceded to Britain in 1842?",
   "options": [
    "Taiwan",
    "Hong Kong Island",
    "Lantau Island",
    "Macau"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which famous harbour separates Hong Kong Island from Kowloon?",
   "options": [
    "Sydney Harbour",
    "Victoria Harbour",
    "Hudson Harbour",
    "Pearl Harbour"
   ],
   "answerIndex": 1
  },
  {
   "question": "For how many years was the New Territories leased in 1898?",
   "options": [
    "25",
    "99",
    "150",
    "50"
   ],
   "answerIndex": 1
  },
  {
   "question": "What is Hong Kong's current official status within China?",
   "options": [
    "A treaty port",
    "A province",
    "An autonomous prefecture",
    "A Special Administrative Region"
   ],
   "answerIndex": 3
  }
 ],
 "bandung": [
  {
   "question": "What was the 1955 Bandung gathering called?",
   "options": [
    "The Bretton Woods Conference",
    "The Geneva Summit",
    "The Asian-African Conference",
    "The Yalta Conference"
   ],
   "answerIndex": 2
  },
  {
   "question": "About how many countries took part?",
   "options": [
    "9",
    "29",
    "90",
    "150"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Indonesian president hosted it?",
   "options": [
    "Hatta",
    "Sukarno",
    "Suharto",
    "Habibie"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which prime minister of Burma attended?",
   "options": [
    "Ne Win",
    "U Nu",
    "Than Shwe",
    "Aung San"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Chinese premier attended?",
   "options": [
    "Zhou Enlai",
    "Mao Zedong",
    "Liu Shaoqi",
    "Deng Xiaoping"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which later movement grew from its spirit?",
   "options": [
    "The Warsaw Pact",
    "The Non-Aligned Movement",
    "The Commonwealth",
    "The European Union"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which two blocs did the delegates avoid aligning with?",
   "options": [
    "Germany and Japan",
    "The US and the Soviet Union",
    "Spain and Portugal",
    "Britain and France"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Egyptian leader took part?",
   "options": [
    "Anwar Sadat",
    "Gamal Abdel Nasser",
    "Mohamed Naguib",
    "Hosni Mubarak"
   ],
   "answerIndex": 1
  },
  {
   "question": "On which island is Bandung?",
   "options": [
    "Java",
    "Sulawesi",
    "Sumatra",
    "Borneo"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which building hosted the sessions?",
   "options": [
    "Borobudur Hall",
    "Gedung Sate",
    "Istana Negara",
    "Gedung Merdeka"
   ],
   "answerIndex": 3
  }
 ],
 "geneva": [
  {
   "question": "Which humanitarian movement was founded in Geneva in 1863?",
   "options": [
    "Oxfam",
    "The Red Cross",
    "Médecins Sans Frontières",
    "Amnesty International"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which Swiss businessman founded it?",
   "options": [
    "Henry Dunant",
    "Jean Calvin",
    "Alfred Nobel",
    "Louis Pasteur"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year was the first Geneva Convention adopted?",
   "options": [
    "1949",
    "1864",
    "1789",
    "1914"
   ],
   "answerIndex": 1
  },
  {
   "question": "What do the Geneva Conventions mainly protect?",
   "options": [
    "Cultural festivals",
    "International trade routes",
    "The wounded, prisoners and civilians in war",
    "Fishing rights"
   ],
   "answerIndex": 2
  },
  {
   "question": "The red cross emblem reverses the flag of which country?",
   "options": [
    "Denmark",
    "England",
    "Austria",
    "Switzerland"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which lake lies beside Geneva?",
   "options": [
    "Lake Léman",
    "Lake Como",
    "Lake Constance",
    "Lake Garda"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which year were the Geneva Conventions revised after the Second World War?",
   "options": [
    "1949",
    "1971",
    "1919",
    "1864"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which UN labour agency founded in 1919 has its headquarters in Geneva?",
   "options": [
    "The International Labour Organization",
    "The IMF",
    "The World Bank",
    "UNESCO"
   ],
   "answerIndex": 0
  },
  {
   "question": "What did the 1954 Geneva Accords do in Vietnam?",
   "options": [
    "Made it a French colony",
    "Gave it to China",
    "Created a single republic",
    "Temporarily divided it at the 17th parallel"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which status has Switzerland long maintained in wars?",
   "options": [
    "Neutrality",
    "Membership of NATO",
    "Military occupation",
    "Alliance with France"
   ],
   "answerIndex": 0
  }
 ],
 "the-hague": [
  {
   "question": "Which UN court sits in The Hague and settles disputes between states?",
   "options": [
    "The European Court of Human Rights",
    "The Supreme Court of the Netherlands",
    "The Court of Arbitration for Sport",
    "The International Court of Justice"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which building, funded by Andrew Carnegie, houses the ICJ?",
   "options": [
    "The Binnenhof",
    "The Peace Palace",
    "The Reichstag",
    "The Palais des Nations"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which court prosecutes individuals for genocide and war crimes?",
   "options": [
    "The International Criminal Court",
    "The Court of Auditors",
    "The Nuremberg Tribunal",
    "The Permanent Court of Arbitration only"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which treaty founded the ICC?",
   "options": [
    "The Geneva Statute",
    "The Vienna Statute",
    "The Hague Statute",
    "The Rome Statute"
   ],
   "answerIndex": 3
  },
  {
   "question": "In which year did the ICJ hold its first sitting?",
   "options": [
    "1989",
    "1914",
    "1899",
    "1946"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which 1899 gathering was the first Hague Peace Conference?",
   "options": [
    "A chess tournament",
    "A conference on arms limits and arbitration",
    "A royal wedding",
    "A trade fair"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which city is the Dutch capital, even though government sits in The Hague?",
   "options": [
    "Rotterdam",
    "Utrecht",
    "Amsterdam",
    "Eindhoven"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which tribunal, based in The Hague, tried crimes in the 1990s Balkan wars?",
   "options": [
    "The ICTR",
    "The ICTY",
    "The Tokyo Tribunal",
    "The Special Court for Sierra Leone"
   ],
   "answerIndex": 1
  },
  {
   "question": "What do the 1899 and 1907 Hague Conventions regulate?",
   "options": [
    "The conduct of war",
    "Postal services",
    "Maritime tariffs",
    "Football rules"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which sea lies just west of The Hague?",
   "options": [
    "The Irish Sea",
    "The Baltic Sea",
    "The Adriatic Sea",
    "The North Sea"
   ],
   "answerIndex": 3
  }
 ],
 "san-francisco": [
  {
   "question": "Which founding document was signed in San Francisco in 1945?",
   "options": [
    "The Marshall Plan",
    "The Atlantic Charter",
    "The Treaty of Versailles",
    "The United Nations Charter"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which date was the Charter signed?",
   "options": [
    "24 October 1945",
    "8 May 1945",
    "26 June 1945",
    "6 August 1945"
   ],
   "answerIndex": 2
  },
  {
   "question": "How many original member states joined the UN?",
   "options": [
    "193",
    "101",
    "51",
    "15"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which UN body has five permanent members with veto power?",
   "options": [
    "The Trusteeship Council",
    "The Secretariat",
    "The General Assembly",
    "The Security Council"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which of these was a founding permanent member?",
   "options": [
    "Germany",
    "China",
    "India",
    "Japan"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which famous bridge spans the bay near the conference city?",
   "options": [
    "The Rialto",
    "The Brooklyn Bridge",
    "The Golden Gate Bridge",
    "Tower Bridge"
   ],
   "answerIndex": 2
  },
  {
   "question": "Where is UN headquarters today?",
   "options": [
    "Geneva",
    "Vienna",
    "New York",
    "Paris"
   ],
   "answerIndex": 2
  },
  {
   "question": "Who was the first UN Secretary-General?",
   "options": [
    "Kofi Annan",
    "Dag Hammarskjöld",
    "U Thant",
    "Trygve Lie"
   ],
   "answerIndex": 3
  },
  {
   "question": "Who chaired the US delegation at the conference?",
   "options": [
    "Edward Stettinius",
    "Cordell Hull",
    "Dean Acheson",
    "George Marshall"
   ],
   "answerIndex": 0
  },
  {
   "question": "On what date did the UN officially come into being?",
   "options": [
    "24 October 1945",
    "4 July 1945",
    "1 January 1946",
    "26 June 1945"
   ],
   "answerIndex": 0
  }
 ],
 "new-york-city": [
  {
   "question": "On which date did the September 11 attacks take place?",
   "options": [
    "6 June 1944",
    "7 December 1941",
    "22 November 1963",
    "11 September 2001"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which complex's twin towers were destroyed?",
   "options": [
    "The World Trade Center",
    "The Empire State Building",
    "The Chrysler Building",
    "Rockefeller Center"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which memorial and museum stands on the site?",
   "options": [
    "The Statue of Liberty",
    "The Vietnam Veterans Memorial",
    "The National September 11 Memorial and Museum",
    "The Lincoln Memorial"
   ],
   "answerIndex": 2
  },
  {
   "question": "Why is One World Trade Center 1,776 feet tall?",
   "options": [
    "It echoes the year of American independence",
    "It matches the old towers",
    "It was chosen at random",
    "It marks the city's founding"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which mayor led New York through the crisis?",
   "options": [
    "Michael Bloomberg",
    "Ed Koch",
    "Fiorello La Guardia",
    "Rudy Giuliani"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which US president was in office?",
   "options": [
    "Bill Clinton",
    "George H. W. Bush",
    "Barack Obama",
    "George W. Bush"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which group claimed responsibility?",
   "options": [
    "Hezbollah",
    "Al-Qaeda",
    "The Red Army Faction",
    "The IRA"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which country did the US begin military operations in October 2001?",
   "options": [
    "Somalia",
    "Libya",
    "Iraq",
    "Afghanistan"
   ],
   "answerIndex": 3
  },
  {
   "question": "On which borough's southern tip did the towers stand?",
   "options": [
    "The Bronx",
    "Brooklyn",
    "Queens",
    "Manhattan"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which US department was created in 2002 in response?",
   "options": [
    "The Department of Education",
    "The Department of Energy",
    "The Department of Homeland Security",
    "NASA"
   ],
   "answerIndex": 2
  }
 ],
 "pompeii": [
  {
   "question": "Which volcano buried Pompeii?",
   "options": [
    "Mount Etna",
    "Mount Vesuvius",
    "Mount Olympus",
    "Stromboli"
   ],
   "answerIndex": 1
  },
  {
   "question": "In which year did the eruption occur?",
   "options": [
    "1 CE",
    "476 CE",
    "79 CE",
    "1631 CE"
   ],
   "answerIndex": 2
  },
  {
   "question": "Beside which bay did Pompeii lie?",
   "options": [
    "Botany Bay",
    "The Bay of Naples",
    "The Bay of Bengal",
    "The Bay of Biscay"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which writer described the eruption in letters to Tacitus?",
   "options": [
    "Virgil",
    "Horace",
    "Pliny the Younger",
    "Ovid"
   ],
   "answerIndex": 2
  },
  {
   "question": "What do archaeologists pour into hollows to show victims' final poses?",
   "options": [
    "Glass",
    "Wax",
    "Bronze",
    "Plaster"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which nearby town was also buried?",
   "options": [
    "Brundisium",
    "Ostia",
    "Capua",
    "Herculaneum"
   ],
   "answerIndex": 3
  },
  {
   "question": "What materials buried the town?",
   "options": [
    "Lava flows only",
    "Mud and snow",
    "Sand dunes",
    "Ash and pumice"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which famed house is known for its frescoes of a mystery rite?",
   "options": [
    "Hadrian's Villa",
    "The Golden House",
    "The Villa of the Mysteries",
    "The House of the Vettii only"
   ],
   "answerIndex": 2
  },
  {
   "question": "In which year did systematic excavations begin?",
   "options": [
    "1948",
    "1748",
    "1598",
    "1348"
   ],
   "answerIndex": 1
  },
  {
   "question": "What does the mosaic warning 'Cave canem' mean?",
   "options": [
    "Welcome, friend",
    "Bath this way",
    "House for sale",
    "Beware of the dog"
   ],
   "answerIndex": 3
  }
 ],
 "chernobyl": [
  {
   "question": "On which date did the Chernobyl disaster occur?",
   "options": [
    "26 April 1986",
    "28 January 1986",
    "1 June 1979",
    "11 March 2011"
   ],
   "answerIndex": 0
  },
  {
   "question": "Which Soviet scientist led the commission investigating the accident?",
   "options": [
    "Pyotr Kapitsa",
    "Igor Kurchatov",
    "Valery Legasov",
    "Andrei Sakharov"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which reactor exploded?",
   "options": [
    "Reactor No. 9",
    "Reactor No. 12",
    "Reactor No. 4",
    "Reactor No. 1"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which nearby town was built for plant workers?",
   "options": [
    "Lviv",
    "Kharkiv",
    "Odessa",
    "Pripyat"
   ],
   "answerIndex": 3
  },
  {
   "question": "About how wide is the exclusion zone's radius?",
   "options": [
    "About 1 kilometre",
    "About 300 kilometres",
    "About 30 kilometres",
    "About 3 kilometres"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which giant arch now covers the destroyed reactor?",
   "options": [
    "The Liberty Shell",
    "The New Safe Confinement",
    "The Atom Cap",
    "The Peace Dome"
   ],
   "answerIndex": 1
  },
  {
   "question": "What was happening when the explosion occurred?",
   "options": [
    "A routine refuelling",
    "A military drill",
    "A sabotage attempt",
    "A safety test"
   ],
   "answerIndex": 3
  },
  {
   "question": "What level did it receive on the international nuclear event scale?",
   "options": [
    "5",
    "1",
    "3",
    "7"
   ],
   "answerIndex": 3
  },
  {
   "question": "What is the pine forest near the plant, whose trees turned reddish, called?",
   "options": [
    "The Sherwood",
    "The Black Forest",
    "The Red Forest",
    "The Białowieża"
   ],
   "answerIndex": 2
  },
  {
   "question": "What were the clean-up workers commonly called?",
   "options": [
    "Firebirds",
    "Guardians",
    "Reclaimers",
    "Liquidators"
   ],
   "answerIndex": 3
  }
 ],
 "tikal": [
  {
   "question": "Which civilisation built Tikal?",
   "options": [
    "The Olmecs",
    "The Incas",
    "The Maya",
    "The Aztecs"
   ],
   "answerIndex": 2
  },
  {
   "question": "Which is the tallest temple at Tikal?",
   "options": [
    "Temple V",
    "Temple I",
    "Temple II",
    "Temple IV"
   ],
   "answerIndex": 3
  },
  {
   "question": "What is Temple I commonly nicknamed?",
   "options": [
    "The Temple of the Great Jaguar",
    "The Temple of Inscriptions",
    "The Temple of Warriors",
    "The Temple of the Sun"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which rainforest region does Tikal lie?",
   "options": [
    "The Chiapas Plateau",
    "The Amazon Basin",
    "The Yucatán Highlands",
    "The Petén"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which rival Maya city fought Tikal for centuries?",
   "options": [
    "Palenque",
    "Calakmul",
    "Copán",
    "Chichén Itzá"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which great Mexican city's influence reached Tikal in 378 CE?",
   "options": [
    "Tenochtitlan",
    "Teotihuacan",
    "Monte Albán",
    "Tula"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which king defeated Calakmul in 695 CE?",
   "options": [
    "Kukulkan",
    "Moctezuma I",
    "Pakal the Great",
    "Jasaw Chan K'awiil I"
   ],
   "answerIndex": 3
  },
  {
   "question": "What kind of writing did the Maya use?",
   "options": [
    "Cuneiform",
    "Knotted cords",
    "Alphabetic script",
    "Hieroglyphs"
   ],
   "answerIndex": 3
  },
  {
   "question": "What happened to many lowland Maya cities around 900 CE?",
   "options": [
    "They were flooded by the sea",
    "They were abandoned in the Classic collapse",
    "They merged into one empire",
    "They were conquered by Rome"
   ],
   "answerIndex": 1
  },
  {
   "question": "Which ritual sport did the Maya play with a rubber ball?",
   "options": [
    "Polo",
    "Lacrosse",
    "Tennis",
    "The Mesoamerican ballgame"
   ],
   "answerIndex": 3
  }
 ],
 "machu-picchu": [
  {
   "question": "Which Yale lecturer brought Machu Picchu to world attention in 1911?",
   "options": [
    "Hiram Bingham",
    "Heinrich Schliemann",
    "Arthur Evans",
    "Howard Carter"
   ],
   "answerIndex": 0
  },
  {
   "question": "In which mountain range does Machu Picchu lie?",
   "options": [
    "The Himalayas",
    "The Rockies",
    "The Alps",
    "The Andes"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which river winds below the site?",
   "options": [
    "The Amazon main channel",
    "The Magdalena",
    "The Orinoco",
    "The Urubamba"
   ],
   "answerIndex": 3
  },
  {
   "question": "What masonry style fits its blocks together without mortar?",
   "options": [
    "Brick vaulting",
    "Wattle and daub",
    "Rammed earth",
    "Ashlar masonry"
   ],
   "answerIndex": 3
  },
  {
   "question": "Which steep peak rises behind the ruins?",
   "options": [
    "Aconcagua",
    "Chimborazo",
    "Huayna Picchu",
    "Misti"
   ],
   "answerIndex": 2
  },
  {
   "question": "At about what elevation does it stand?",
   "options": [
    "About 243 metres",
    "About 4,300 metres",
    "About 6,000 metres",
    "About 2,430 metres"
   ],
   "answerIndex": 3
  },
  {
   "question": "In which year was it named a UNESCO World Heritage Site?",
   "options": [
    "1911",
    "2007",
    "1983",
    "1950"
   ],
   "answerIndex": 2
  },
  {
   "question": "What is the carved Intihuatana stone often called?",
   "options": [
    "The gate of the moon",
    "The well of ancestors",
    "The hitching post of the sun",
    "The throne of kings"
   ],
   "answerIndex": 2
  },
  {
   "question": "Why did the site escape Spanish destruction?",
   "options": [
    "It was guarded by Inca armies",
    "The conquistadors never found it",
    "It was buried under a landslide",
    "It was protected by a treaty"
   ],
   "answerIndex": 1
  },
  {
   "question": "What do most scholars believe the site was?",
   "options": [
    "A prison fortress",
    "A grain market",
    "A trading port",
    "A royal estate"
   ],
   "answerIndex": 3
  }
 ]
}
