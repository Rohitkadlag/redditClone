const fs = require("fs");

// Paste the multiline string directly here
const rawText = `
university_name
Academy of Art University
Arkansas State University
Augustana University
Auburn University at Montgomery
(Kaplan) Arizona State University
California Lutheran University
(Shorelight) Adelphi University
California Baptist University
California State Polytechnic University, Pomona (College of the Extended University)
Dallas Baptist University
DeVry University
(INTO) Drew University
Duquesne University
East Carolina University
California State University, Northridge
Eastern Michigan University
Drexel University
Dakota State University
The Catholic University of America
California State University, Sacramento
California State University, Los Angeles - Extension
California State University, Los Angeles
California State University, San Bernardino
California State University, Chico
California State University, East Bay
California State University, Dominguez Hills
California State University, Bakersfield
California State University, Stanislaus
California State University, Channel Islands
California State University, Fresno
Fisher College
Florida Institute Of Technology
(Study Group) Florida Atlantic University
Franklin University
Florida International University, Florida
Fairleigh Dickinson University â€“ FDU ( Vancouver, Canada )
Embry Riddle Aeronautical University
Felician University
Full Sail University
Gannon University
Fairleigh Dickinson University (USA)
Governors State University
Hult International Business School Boston,San Francisco campus
Indiana University of Pennsylvania
Golden Gate University
(INTO) Illinois State University
Georgia State University
(INTO) George Mason University
(INTO) Hofstra University
Grand Valley State University, Michigan
Green River College
George Mason University- Korea
Lehigh University
Kent State University
Lawrence Technological University
(INTO) Jefferson University, St, Philadelphia, Pennsylvania
Kennesaw State University
(Shorelight) Johns Hopkins University
(Study Group) James Madison University
Lewis University
Johnson & Wales University
Kutztown University
Lawrence Technological University (Michigan) and Pune Institute of Business Management (Pune)
Johnson & Wales University - Charlotte
New York Institute of Technology
Middle Tennessee State University
Lycoming College
Miami University, Oxford
Massachusetts College of Pharmacy and Health Sciences (MCPHS University)
(Shorelight) Louisiana State University
(Study Group) Lipscomb University
Midway University
Marquette University
Marshall University
(Study Group) Long Island University Post (LIU Post)
(Study Group) Long Island University Brooklyn (LIU Brooklyn)
Missouri State University
Milwaukee School of Engineering
Mississippi State University
Murray State University
(INTO) Montclair State University
Montana State University
Midwestern State University
New York Institute of Technology - NYIT ( Vancouver, Canada )
Mississippi College
Missouri University of Science and Technology
Southeast Missouri State University
Northwest Missouri State University
International University of Applied Sciencesâ€”IU
Northwood University
New Jersey Institute of Technology
Nebraska Wesleyan University
(INTO) New England College
New York Film Academy
Nova Southeastern University
Northern Arizona University
Northwest Executive Education - Northwood University
National University of Singapore(NUS)
Tokyo International University
International University of Monaco
Symbiosis International University, Dubai
Oklahoma State University - Stillwater
Purdue University - Northwest
Ohio University
Post University
Pittsburg State University
Park University
(Kaplan) Pace University
(INTO) Oregon State University
Oklahoma City University
Portland State University
Rochester Institute of Technology
SUNY Polytechnic Institute
Rivier University
Saint Leo University
Rowan University
Rider University
Saginaw Valley State University
Richard Bland College of William & Mary, Petersburg, Virginia
Sacred Heart University
Roosevelt University
Rochester Institute of Technology Dubai (RIT Dubai)
Seattle University
(INTO) Saint Louis University
Seattle Colleges
Savannah College of Art and Design - Savannah
Santa Monica College
Santa Rosa Junior College
San Jose State University
(Kaplan) Simmons University
Santa Ana College
San Francisco State University
Savannah College of Art and Design - Atlanta
Slippery Rock University
Southern Illinois University Edwardsville
Missouri Southern State University
St. Thomas University
Southern Illinois University Carbondale
Sonoma State University
Southwest Minnesota State University
Southern New Hampshire University
South Dakota School of Mines & Technology
Tennessee Tech University
State University of New York Oswego (SUNY Oswego)
Texas Wesleyan University
Stevens Institute of Technology
Tiffin University
SIM Global Education
(INTO) Suffolk University
Texas A & M University - Corpus Christi
Texas State University
Trine University
University of Albany, The State University of New York, Albany (SUNY Albany)
American Institute of Applied Sciences in Switzerland
Texas A & M University - Kingsville
The State University of New York at New Paltz (SUNY New Paltz)
Texas State University - Round Rock
State University of New York, Fredonia
State University of New York, Geneseo (SUNY Geneseo)
University of Arizona
University of Bridgeport
University of Cincinnati
University of Central Florida
University of California Berkeley Extension
Troy University
University of Massachusetts Dartmouth (UMass Dartmouth)
(INTO) University of Alabama at Birmingham
University Of Central Oklahoma
University of California, Berkeley
University of California, Los Angeles
University of California, Irvine Division of Continuing Education
University of California Riverside
University of California Riverside - College of Engineering
University of California Riverside Extension
University of California, Santa Cruz, Silicon Valley Extension (Professional Education)
The University of Alabama, Tuscaloosa
(Shorelight) University of Illinois Chicago
(Kaplan) University of Connecticut
University of Colorado Denver
The University of Findlay
(Shorelight) University of Illinois Springfield
University of Delaware
University of Idaho
University of Denver, Colorado (Danielâ€™s College of Business only)
University of Colorado Colorado Springs
(Shorelight) University of Dayton
University of Mary Hardin-Baylor
(Shorelight) University of Massachusetts Boston (UMass Boston)
The University of Memphis
University of Massachusetts Lowell (UMass Lowell)
University of Michigan-Flint
University of Maryland Baltimore County
University of Michigan
University of Kansas
(Kaplan) University of Oregon
University of North Carolina Wilmington
University of New Haven
University of New Mexico
University of North Florida
University of New Hampshire
University of Missouriâ€“St. Louis (UMSL)
The University of Nebraska-Lincoln
University of North Texas
University of Oregon
University of Nebraska at Omaha
University of North Texas - Frisco
University of Tampa
University of Tulsa
University of Texas at Austin
University of St. Thomas
University of South Florida
University of South Carolina Upstate
University of Toledo
University of Tennessee at Chattanooga
The University of Scranton
University of South Alabama
University of Wisconsin Milwaukee, Wisconsin
University of Wisconsinâ€“La Crosse
Valparaiso University
University of Wisconsin-Eau Claire
(Shorelight) University of the Pacific
(Shorelight) University of Utah
Upper Iowa University
Norwich University of the Arts
University of Vermont (Only UG)
University of Wisconsin-Stout
University of Wisconsin-Superior
Washington State University
Western Kentucky University
Western Illinois University - Macomb
Weber State University
Western New England University
Webster University - (St. Louis, Missouri)
(Study Group) Western Washington University
Virginia Tech Language and Culture Institute
Westcliff University
Western Oregon University
Webster University - (San Antonio, Texas)
Western Illinois University - Quad Cities
Washington State University - Vancouver (USA) Campus
Washington State University - Tri-Cities Campus
Whittier College
Yeshiva University
Worcester Polytechnic Institute
Woodbury University, Burbank, California
Youngstown State University
Wright State University
Wichita State University
York College of Pennsylvania
Acadia University
Northern College, Timmins
University of Ottawa
Bow Valley College - BVC
British Columbia Institute of Technology - BCIT
Adler University
Cambrian College
Acsenda School of Management
Brock University
Canadore College - College Drive North Bay Campus
Canadore College - Commerce Court North Bay Campus
Canadore College - West Parry Sound Campus
Dalhousie University
Cape Breton University - CBU
Carleton University
Conestoga College - Brantford Campus
Crandall University
Confederation College - Thunder Bay Campus
College of the Rockies - COTR
College of New Caledonia - CNC ( Prince George Campus )
Douglas College
Capilano University
Conestoga College - Cambridge Campus
Crandall University - Sussex
Conestoga College - Guelph Campus
Conestoga College - Doon Campus
Conestoga College - Waterloo Campus
Conestoga College - Milton Parkhill Drive Campus
Conestoga College - Kitchener (Downtown) Campus
Conestoga College - Reuter Drive Campus
Conestoga College - Milton( Steeles Avenue East)
Durham College
Fleming College
Simon Fraser University through Fraser International College
George Brown College - GBC (Casa Loma Campus)
Georgian College
Fanshawe College
Justice Institute of British Columbia - JIBC
University of Manitoba through International College of Manitoba
Great Plains College
George Brown College - GBC (St. James Campus)
George Brown College - GBC (Waterfront Campus)
Kingâ€™s University College (University of Western Ontario)
MacEwan University
Langara College
University of Bedfordshire
Lambton College - Sarnia Campus
Kwantlen Polytechnic University - KPU
LaSalle College, Montreal
Lakehead University, Orillia
Laurentian University
Lakeland College
LaSalle College, Vancouver
Lambton College - Ottawa Campus
Lakehead University, Thunder Bay
Mount Saint Vincent University - MSVU
Memorial University of Newfoundland - MUN
Niagara College
Mount Allison University
Nipissing University
Medicine Hat College - MHC
Manitoba Institute of Trades and Technology - MITT
NorQuest College
Memorial University of Newfoundland - MUN (Grenfell Campus)
Ontario Tech University
Northern Lights College - NLC
Northern Alberta Institute of Technology - NAIT
North Island College - NIC
UQ College
Providence University College
Toronto Metropolitan University through Toronto Metropolitan International College - TMUIC
Royal Roads University - RRU
(INTO) Queen's University Belfast
Selkirk College
St. Francis Xavier University - StFX
St. Clair College, Ontario
Sheridan College - Davis Campus (Brampton)
Southern Alberta Institute of Technology - SAIT
St. Mary's University Twickenham, London
Saskatchewan Polytechnic, Moose Jaw
St. Lawrence College - SLC ( Brockville Campus )
St. Lawrence College - SLC (Cornwall Campus)
St. Lawrence College - SLC (Kingston Campus)
Saskatchewan Polytechnic, Prince Albert
Saskatchewan Polytechnic, Saskatoon
Sheridan College - Hazel McCallion Campus (Mississauga)
Sheridan College - Trafalgar Campus (Oakville)
Saskatchewan Polytechnic, Regina
University Canada West - UCW
University of Calgary Continuing Education
Nottingham Trent University
Thompson Rivers University - TRU
University of Alberta
Suncrest College
Trinity Western University - TWU
Toronto Metropolitan University - TMU
Vancouver Premier College - VPC
University of Alberta in Partnership with Kaplan
Trent University
University of Prince Edward Island - UPEI
University of Victoria
University of Waterloo
University of New Brunswick - UNB
University of Guelph
University of Lethbridge
University of Regina
University of Northern British Columbia - UNBC
University of Niagara Falls - UNF
University of Manitoba
University of Lethbridge through International College Calgary - UICC
University of New Brunswick - UNB (Saint John)
Wilfrid Laurier University - WLU
Vancouver Community College - VCC
University of Windsor
York University
University of the Fraser Valley - UFV
University of Winnipeg
Vancouver Film School - VFS
Wilfrid Laurier International College - WLIC
Abertay University
(ONCAMPUS) Aston University
Global Business School, Malta
Bangor University
(ONCAMPUS) Birkbeck, University of London
Birmingham City University
(NAVITAS) Anglia Ruskin University College
Aberystwyth University
Bishop Grosseteste University
(KAPLAN) Bournemouth University
Bath Spa University, Ras Al-Khaimah
Aston University
(NAVITAS) Birmingham City University- International College
(OXFORD INTERNATIONAL EDUCATION GROUP) Bangor University International College
Anglia Ruskin University (Chelmsford)
Nanyang Institute of Management
Aston University, London
Anglia Ruskin University (Cambridge)
Anglia Ruskin University, London
Anglia Ruskin University, Peterborough
Anglia Ruskin University, Writtle
Cambridge School of Visual & Performing Arts
De Montfort University, Dubai
Cardiff Metropolitan University
Cardiff University
Coventry University, Coventry
(STUDY GROUP) Durham University, Durham
Canterbury Christ Church University
Cranfield University
De Montfort University
Durham University
(OXFORD INTERNATIONAL EDUCATION GROUP) De Montfort University International College
Institute of Business, Technology and Engineering (IBTE), Dubai
PSB Academy
(STUDY GROUP) Cardiff University International Study Centre
Coventry University, London
IBA Kolding, Denmark
Coventry University, Wroclaw
Raffles College of Higher Education
(ONCAMPUS) Goldsmiths University of London
Heriot Watt University - Dubai
Istituto Marangoni
Edinburgh Napier University
(KAPLAN) University of Nottingham International College
(NAVITAS) Hertfordshire International College
(KAPLAN) University of Glasgow International College
Hult International Business School (Dubai)
Hult International Business School
(STUDY GROUP) The University of Sheffield International College
Heriot Watt University
Istituto Marangoni, Dubai
(OXFORD INTERNATIONAL EDUCATION GROUP) Edinburgh Napier University International College
Hotel & Tourism Management Institute Switzerland (HTMi)
Goldsmiths, University of London
(KAPLAN) University of Liverpool International College
Western Sydney University International College (Navitas)
(OXFORD INTERNATIONAL EDUCATION GROUP) University of Kent International College
(NAVITAS) London Brunel International College
(KAPLAN) University of Essex International College
(OXFORD INTERNATIONAL EDUCATION GROUP) International College Dundee
(NAVITAS) International College of Portsmouth
(KAPLAN) Nottingham Trent International College
(NAVITAS) University of Plymouth International College
Lancaster University
Kingston University
Liverpool Hope University
London South Bank University
Keele University
(STUDY GROUP) Liverpool John Moores University, Liverpool
Leeds Beckett University
(ONCAMPUS) London South Bank University
(STUDY GROUP) Leeds Beckett University, Leeds
(NAVITAS) Keele University International College
(INTO) Lancaster University
Lancaster University, Leipzig
(INTO) London World Education Centre
Manchester Metropolitan University
Loughborough University
Northumbria University, London
Middlesex University
Oxford Brookes University
Newcastle University
Northumbria University, Newcastle
Middlesex University - Dubai
Middlesex University, Mauritius
Loughborough University, London
(ONCAMPUS) Loughborough University
International Management Institute
Teesside University
(ONCAMPUS) Royal Veterinary College, University of London
Queen Mary University of London
Ravensbourne University London
Sheffield Hallam University
(NAVITAS) Robert Gordon University
Southampton Solent University
Royal Holloway University of London
Robert Gordon University
(QAHE) Solent University
(STUDY GROUP) Teesside University International Study Centre
(STUDY GROUP) Royal Holloway, University of London International Study Centre
Teesside University (London)
(KAPLAN) UWE Bristol
(STUDY GROUP) University of Aberdeen International Study Centre
University of Birmingham - Dubai
Ulster University, London Campus
Berlin School of Business and Innovation (BSBI), Berlin and Hamburg
University of Bath
University College Birmingham
(NAVITAS) University Academy 92
Ulster University, Birmingham Campus
University for the Creative Arts
Ulster University, Manchester Campus
University of Birmingham
University of Aberdeen
(KAPLAN) University of Birmingham
University of Lancashire (Previously known as University of Central Lancashire)
University of Bradford
University of Greater Manchester (Previously known as University of Bolton)
University of East London
University of East Anglia
University of Bristol
University of Chester
University of Dundee
(KAPLAN) University of Brighton
(ONCAMPUS) University of Central Lancashire
University of Brighton
University of Bolton Ras Al Khaimah, Dubai
(OXFORD INTERNATIONAL EDUCATION GROUP) University of Bradford International College
(KAPLAN) University of Bristol
University of the West of England, Bristol
University of Central Lancashire - Cyprus
University of Glasgow
(INTO) University of East of Anglia
University of Essex
(ONCAMPUS) University of Hull
University of Gloucestershire
University of Greenwich
The University of Huddersfield
(INTO) University of Exeter
University of Hertfordshire
University of Kent
University of Hull, London
University of Hull, Hull
The University of Huddersfield, London
University of Exeter
(STUDY GROUP) University of Huddersfield
(OXFORD INTERNATIONAL EDUCATION GROUP) University of Greenwich International College
(KAPLAN Open Learning) University of Essex
University of Hertfordshire, Sharjah
Kaplan Higher Education Academy (KHEA)
University of Leicester
University of Lincoln
University of Nottingham - Malaysia
University of Liverpool
University of Law (London)
University of Plymouth
The University of Northampton
(STUDY GROUP) University of Leeds, Leeds
University of Nottingham
University of Law (Birmingham)
University of Law (Chester)
University of Law (Liverpool)
University of Law (Manchester)
University of Leeds
University of Law (Norwich)
University of Law (Online)
University of Law (Sheffield)
University of Law (Bristol)
University of Law (Exeter)
University of Law (Leeds)
(KAPLAN Open Learning) University of Liverpool
University of Law (Newcastle)
University of Law (Nottingham)
University of Law (Reading)
University of Law (Southampton)
University of Nottingham, Ningbo, China
University of Salford
University of Portsmouth
(ONCAMPUS) University of Reading
University of Southampton, Malaysia
University of South Wales
University of Roehampton
University of Stirling
(INTO) University of Stirling
(ONCAMPUS) University of Southampton
University of Reading
(QAHE) University of South Wales
The University of Sheffield
University of Southampton
University of Portsmouth, London
University of Southampton (Winchester)
University of Wales Trinity Saint David, London
University of Suffolk, London
University of West London
University of Sunderland, London
University of Strathclyde
University of York
University of Wolverhampton
(STUDY GROUP) University of Sussex, Falmer
University of Surrey
University of the West of Scotland
London School of Commerce, Malta
University of Sunderland, Sunderland
University of Wales Trinity Saint David, Birmingham
University of Wales Trinity Saint David, Swansea
(ONCAMPUS) University of Sunderland
University of the West of Scotland, London
Bella Vista Institute of Higher Education Switzerland, Altdorf
(STUDY GROUP) University of Strathclyde International Study Centre
(STUDY GROUP) University of Surrey International Study Centre
(KAPLAN) University of York
University of Sussex
Atlantic Technological University : Letterkenny
Dublin City University
Griffith College
Maynooth University
Munster Technological University
Shannon College of Hotel Management
South East Technological University (SETU): Waterford
National College of Ireland
Dublin Business School
CCT College Dublin
Atlantic Technological University : Sligo
South East Technological University (SETU) : Carlow
University College Cork
University of Limerick
Technological University Dublin
University College Dublin
Trinity College Dublin
Accadis Hochschule Bad Homburg - University of Applied Sciences
CBS International Business School
EIIE Eurasia Institute for International Education GmbH
EU Business School (Germany)
GISMA Business School Hochschule
Arden University Berlin Study Center
International School of Management
EBS University
EU Business School, Switzerland
EU Business School (Spain)
SRH Berlin University of Applied Sciences
New European College
Macromedia University of Applied Sciences
Schiller International University, Paris Campus
Munich Business School
University of Europe for Applied Sciences
Schiller International University, Heidelberg Campus
Schiller International University, Madrid Campus
SRH Berlin University of Applied Sciences, Leipzig Campus
University of Europe for Applied Sciences, Dubai
Humber Polytechnic
College de Paris
Burgundy School of Business
De Vinci Higher Education
ESSCA School of Management
Marist University
Esigelec Graduate School of Engineering
ESCE International Business School
Foothill-De Anza College
New Zealand Management Academies (NZMA), Auckland
College De Paris, Malta Campus ( Ascencia, Malta )
INSEEC Business School
KEDGE Business School
Institut supÃ©rieur dÃ©lectronique de Paris (ISEP)
Ecole Ducasse, Paris
ICN Business School
Excelia Group, La Rochelle
Institut supÃ©rieur du commerce de Paris - ISC, Paris
ICN Business School, Berlin campus
(On Campus Paris) Kedge Business School
Le Cordon Bleu
NEOMA Business School
Skema Business School
Western Institute of Technology at Taranaki (WITT)
Rennes School of Business
Montpellier Business School
Sunway Le Cordon Bleu (Renowned hospitality school)
(KAPLAN) Queen Mary University of London
(ONCAMPUS) Queen Mary University of London
Queen Mary University of London (Online)
Queen Mary University of London Institute in Paris
Dalarna University
The Hague University of Applied Sciences through The Hague Pathway College
Halmstad University
Kristianstad University
Linnaeus University
Radboud University
Global School for Entrepreneurship, Haarlem Campus
University of Twente through Twente Pathway College
TIO University of Applied Sciences
Uppsala University
Wittenborg University of Applied Sciences
University of Twente, Enschede
University of SkÃ¶vde
Aarhus University
Arcada University of Applied Sciences
Business & Hotel Management School (BHMS)
C3S Business School, Barcelona
Cesar Ritz
DOMUS Academy
American University of Ras Al Khaimah
Vanderbilt University
Culinary Arts Academy (CAA)
Istituto Europeo di Design - IED
Instituto Europeo di Design - IED
IHMGS, International Hotel Management Gastronomy School
University of Wollongong, Malaysia
Kazimieras Simonavicius University, Vilnius
University of Technology Sydney
University of New South Wales, Sydney
The University of Adelaide
International Business School (IBS)
Swinburne University of Technology
International Business School
DePaul University
Queenâ€™s University, Canada
The University of Queensland
Colorado State University
University of Western Australia
University at Buffalo, The State University of New York, Buffalo (SUNY Buffalo)
University of Auckland
Dartmouth College
Deakin University
RMIT University
Macquarie University
Virginia Commonwealth University
Griffith University
University of Wollongong
Queens University Belfast
(INTO) The University of Oklahoma, Norman, Oklahoma
La Trobe University, Melbourne
La Trobe College
Flinders University
University of Louisville
Brunel University of London
(QAHE) Northumbria University
(NAVITAS) The College, Swansea University
Swansea University
University of Canterbury
(INTO) City University of London
City, University of London
University of Galway, Ireland
University of Waikato
Auckland University of Technology
Central Michigan University
Ball State University
(STUDY GROUP) University of Kingston International Study Centre
University of Derby
(Shorelight) Cleveland State University
University of South Dakota
Victoria University of Wellington
University of Staffordshire
London Metropolitan University
University of Central Arkansas
York St John University (York)
Xavier University
(Study Group) University of Hartford
Roger Williams University, Bristol, Rhode Island
Marymount University
Truman State University
Southern Utah University, Cedar, Utah
Leeds Trinity University
Maryville University
Shoreline Community College
Central Methodist University
Monroe University
William Jessup University
McMurry University
Franklin College
Charleston Southern University
Finger Lakes Community College
Sydney Institute of Business & Technology.
St George's, University of London
Neapolis University, Pafos
Niagara University, Ontario
Australian College of Applied Professions
Murdoch University, Perth
Polimi Graduate School of Management
NABA-Nuova Accademia Di Belle Arti
LUT University, Lappeenranta
Modul University
Les Roches
La Trobe Sydney (Navitas)
LAB University of Applied Sciences
Swiss Education Academy
Swiss Business School
Les Roches, Marbella Campus
Abu Dhabi Hospitality Academy Les Roches, Dubai
Western Sydney University, Sydney City (Navitas)
Charles Sturt University, Sydney (Navitas)
Charles Sturt University Melbourne (Navitas)
(Navitas) Queens College
Tampere University of Applied Sciences (TAMK), Tampere
Swiss Educational College, Weggies
University of Debrecen
UCAM International
Turku University of Applied Sciences
Swiss Hotel Management School (SHMS)
Budapest University of Economics and Business
University of Eastern Finland
Vilnius University
University of Nicosia
University of Vaasa
University of Padua
University of Southern Denmark, Odense and Sonderborg Campus
Abu Dhabi University
Curtin University, Dubai
Emirates Aviation University
HTMI Switzerland, Dubai
Institute of Management Technology, Dubai
Curtin College
Manipal University
University of Wollongong - Dubai
University of Wollongong, GIFT City Campus
Charles Darwin University International College- Up Education
Deakin College
Engineering Institute of Technology
Excelsia College
Charles Darwin University
James Cook University, Townsville
Eynesbury College
International College of Management Sydney
James Cook University (JCU) - Singapore
James Cook University, Brisbane
James Cook University, Cairns
Russo Business School
UP Education- Swinburne University of Technology
Queensland University of Technology
Monash College
Murdoch University - Dubai
South Australia Institute of Business & Technology
RMIT University, Vietnam
Swinburne University of Technology, Malaysia
University of Canberra College
University of Adelaide College
University of South Australia
University of Newcastle College of International Education
UTS College
University of Newcastle
University of Canberra,Â  Sydney Hills- ECA
University of the Sunshine Coast, Adelaide
University of Tasmania
UP Education University of Tasmania
University of Tasmania ECA Melbourne
Victoria University Sydney- ECA
Victoria UniversityÂ Brisbane
Ara Institute of Canterbury
Global College Malta
Kudan Institute of Japanese language & Culture
Lincoln University
Eastern Institute of Technology
Manukau Institute of Technology
Massey University
New Zealand Airline Academy
Toi Ohomai Institute of Technology
Otago Polytechnic
North Tec
Pacific International Hotel Management School
Southern Institute of Technology
University of Waikato College
UC International College, Christchurch
Wellington Institute of Technology (WelTec)
Unitec Institute of Technology
Whitireia New Zealand
Berkeley College, New York
Berkeley College, New Jersey
`;

// Split by newline and trim entries
const universities = rawText
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((name) => ({ university_name: name }));

// Convert to JSON
const jsonOutput = JSON.stringify(universities, null, 2);

// Save to file or print
fs.writeFileSync("universities.json", jsonOutput, "utf-8");
console.log("✅ JSON saved to universities.json");
