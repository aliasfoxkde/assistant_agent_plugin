# Homographs

English's written form, like many languages', contains homographs. A homograph is a word that shares the same written form as a word but has one or both of: a different meaning, or a different pronunciation.

For the purpose of the Rime TTS API, we are only concerned with the latter. For example, the words sow (verb, to plant seed) and sow (noun, a female pig) are spelled identically but pronounced differently. This poses a problem for any speech synthesis technology, but Rime leverages both contextual syntactic analysis and frequency information to generate likely predictions.

In the unlikely event that Rime's predicted pronunciation is incorrect, we also provide a straightforward way of overriding these pronunciations:

## Homograph Specification Example
```
    ## Fruits and vegetables?
    text = "I like fresh produce_noun."
    
    ## Making things?
    text = "They produce_verb a wide array of home goods for decorations."
```


A complete list of the homographs for which you can specify a disambiguated variant can be found in the table below.

## List of Homographs

| Homograph | wordid | example sentence |
| --- | --- | --- |
| abstract | abstract_adj-nou | I like abstract art. |
| abstract | abstract_vrb | I want to abstract away from the detail. |
| abuse | abuse_nou | I won't put up with this abuse. |
| abuse | abuse_vrb | Don't abuse animals. |
| abuses | abuses_nou | These abuses are appalling. |
| abuses | abuses_vrb | She abuses alcohol. |
| addict | addict_nou | He became an addict. |
| addict | addict_vrb | Those drugs can addict you. |
| advocate | advocate_nou | I am an advocate for mental health. |
| advocate | advocate_vrb | I advocate for free speech. |
| affect | affect_nou-psy | He had a strange affect. |
| affect | affect | That doesn't affect our plans. |
| affiliate | affiliate_nou | They're a branch affiliate. |
| affiliate | affiliate_vrb | I don't generally affiliate with them. |
| aged | aged_adj | He was quite aged. |
| aged | aged | He had aged slowly over the years. |
| aggregate | aggregate_adj-nou | I like his work in the aggregate. |
| aggregate | aggregate_vrb | I want to aggregate all the files together. |
| alternate | alternate_adj-nou | I was on the team as an alternate. |
| alternate | alternate_vrb | We should alternate between me and you. |
| analyses | analyses_nou | I read his analyses closely. |
| analyses | analyses_vrb | She analyses things carefully. |
| animate | animate_adj-nou | There wasn't a single animate creature in the area. |
| animate | animate_vrb | I tried to animate the scene. |
| appropriate | appropriate_adj | That behavior is not appropriate. |
| appropriate | appropriate_vrb | We decided to appropriate the funds for our own purposes. |
| approximate | approximate_adj-nou | The approximate distance to the nearest city is 50 miles. |
| approximate | approximate_vrb | I want you to approximate the answer. |
| articulate | articulate_adj | He was quite articulate. |
| articulate | articulate_vrb | She could articulate her thoughts clearly during the presentation. |
| associate | associate_adj-nou | He was an associate professor. |
| associate | associate_vrb | I associate summer with vacations and relaxation. |
| attribute | attribute_nou | That is my favorite attribute of his. |
| attribute | attribute_vrb | They attribute their success to hard work and perseverance. |
| axes | axes_nou | The graph has axes for both the x and y variables. |
| axes | axes_nou-vrb | He bought some axes for the forrestry service. |
| bass | bass | He plays the bass guitar in the band. |
| bass | bass_corp | I cought a bass in the lake. |
| blessed | blessed_adj | The blessed reverand led the service. |
| blessed | blessed_vrb | We feel blessed to have such supportive friends. |
| bologna | bologna_geo | I would love to visit bologna italy. |
| bologna | bologna | Do you want mustard or mayo on your bologna sandwich? |
| bow | bow_nou-knot | He made a bow with a ribbon for the gift. |
| bow | bow_nou-ship | I walked to the bow if the ship. |
| buffet | buffet_nou | We enjoyed a delicious buffet at the party. |
| buffet | buffet_vrb | They tried to buffet us with questions. |
| celtic | celtic_adj-nou-sports | The Celtic culture has a rich history of myths and legends. |
| celtic | celtic | The Celtic guards are the best in the nba. |
| close | close_adj-nou | We were very close to winning. |
| close | close_vrb | Please close the door. |
| combine | combine_nou | I drove a combine on the farm. |
| combine | combine_vrb | Let's combine our efforts to finish the project faster. |
| compact | compact_adj-nou | The apartment is compact but cozy. |
| compact | compact_vrb | We tried to compact the trash into a manageable size. |
| compound | compound_nou | The compound is made up of several buildings. |
| compound | compound_vrb | Our problems started to compound. |
| compress | compress_nou | I put a cold compress on his arm. |
| compress | compress_vrb | You can compress the file to save space. |
| conduct | conduct_nou | I approve of their conduct. |
| conduct | conduct_vrb | The manager will conduct interviews for the new position. |
| confines | confines_nou | The garden is within the confines of the castle walls. |
| confines | confines_vrb | She confines her birds in a small cage. |
| conflict | conflict_nou | They were in conflict over how to proceed with the project. |
| conflict | conflict_vrb | Sometimes priorities conflict with each other. |
| conglomerate | conglomerate_adj-nou | The company is a conglomerate of various smaller businesses. |
| conglomerate | conglomerate_vrb | The telephone companies started to conglomerate. |
| conjugate | conjugate_adj-nou | We learned which word was a conjugate of the other. |
| conjugate | conjugate_vrb | These two verbs conjugate similarly in Spanish. |
| conscript | conscript_nou | I started out as a simple conscript. |
| conscript | conscript_vrb | The attemped to conscript reluctant citizens. |
| console | console_nou | The gaming console offers a wide range of entertainment options. |
| console | console_vrb | I want to console the people who are worried. |
| consort | consort_nou | She is the consort of the king. |
| consort | consort_vrb | I don't usually consort with that sort of person. |
| construct | construct_nou | Money is a social construct. |
| construct | construct_vrb | They plan to construct a new building downtown. |
| consummate | consummate_adj | She is a consummate professional in her field. |
| consummate | consummate_vrb | They planned to consummate the marriage. |
| content | content_adj-nou-vrb | I felt content with the result. |
| content | content_nou | She tried to create more content for her channel. |
| contest | contest_nou | I won the contest. |
| contest | contest_vrb | The decided to contest the decision. |
| contract | contract_nou | They signed a contract to seal the deal. |
| contract | contract_vrb | I don't want to contract any diseases. |
| contrast | contrast_nou | The contrast between the two paintings is striking. |
| contrast | contrast_vrb | We're going to compare and contrast the two films. |
| converse | converse_adj-nou | Let's consider the converse proposition. |
| converse | converse_vrb | Let's converse about something more uplifting. |
| convert | convert_nou | I was a new convert to the religion. |
| convert | convert_vrb | We need to convert the measurements into metric units. |
| convict | convict_nou | The convict swore he was innocent. |
| convict | convict_vrb | The jury voied to convict the man. |
| coordinate | coordinate_adj-nou | He charted the numbers on a coordinate plane. |
| coordinate | coordinate_vrb | The teams need to coordinate their efforts for success. |
| correlate | correlate_nou | The money was just a correlate of our success. |
| correlate | correlate_vrb | These two variables correlate positively. |
| decrease | decrease_nou | The decrease in temperature was noticeable overnight. |
| decrease | decrease_vrb | I tried to decrease the number of problems. |
| defect | defect_nou | There's a defect in this product; we need to fix it. |
| defect | defect_vrb | She wanted to defect from the military. |
| degenerate | degenerate_nou | He worried he would become a degenerate. |
| degenerate | degenerate_vrb | The situation might degenerate into chaos. |
| delegate | delegate_nou | I was voted to become a delegate to the assembly. |
| delegate | delegate_vrb | He will delegate the task to someone else. |
| deliberate | deliberate_adj | It was a deliberate act of sabotage. |
| deliberate | deliberate_vrb | They will deliberate on the matter before making a decision. |
| desert | desert_nou | I visited the sahara desert. |
| desert | desert_vrb | Don't desert your teammates! |
| deviate | deviate_nou | He was considered a deviate in the conservative society. |
| deviate | deviate_vrb | She tends to deviate from the main topic in conversations. |
| diagnoses | diagnoses_nou | The diagnoses were inconclusive, so more tests are needed. |
| diagnoses | diagnoses_vrb | The doctor diagnoses people as part of the job. |
| diffuse | diffuse_adj | There was a diffuse sense of mistrust. |
| diffuse | diffuse_vrb | The essential oils diffuse slowly throughout the room. |
| discard | discard_nou | Put it in the discard pile. |
| discard | discard_vrb | Please discard any expired items from the pantry. |
| discharge | discharge_nou | There was a fluid discharge valve in the machine. |
| discharge | discharge_vrb | The factory is required to discharge its waste responsibly. |
| discount | discount_nou | There's a discount on all items in the store today. |
| discount | discount_vrb | I dont discount the possibility that we're wrong. |
| document | document_nou | I misplaced the document. |
| document | document_vrb | Make sure to document all your expenses for reimbursement. |
| dove | dove_nou | A dove landed gracefully on the windowsill. |
| dove | dove_vrb | He dove from the side of the building. |
| duplicate | duplicate_adj-nou | The duplicate was not as good as the original. |
| duplicate | duplicate_vrb | Be careful not to duplicate your efforts unnecessarily. |
| elaborate | elaborate_adj | It was an elaborate ruse. |
| elaborate | elaborate_vrb | Please elaborate on your plans for the project. |
| entrance | entrance_nou | The grand entrance to the palace was breathtaking. |
| entrance | entrance_vrb | They entrance the audience with their performance. |
| escort | escort_nou | He were serving as my escort. |
| escort | escort_vrb | Please escort yourself from the room. |
| estimate | estimate_nou | Can you give me an estimate of how long it will take? |
| estimate | estimate_vrb | I was trying to estimate the damage. |
| excuse | excuse_nou | He had to come up with a believable excuse for his absence. |
| excuse | excuse_vrb | You history doesn't excuse your behavior. |
| expatriate | expatriate_nou | An expatriate may find it challenging to adjust to a new culture. |
| expatriate | expatriate_vrb | He chose to expatriate to pursue better job opportunities. |
| exploit | exploit_nou | We found an exploit in the system. |
| exploit | exploit_vrb | They tried to exploit the natural resources of the region. |
| export | export_nou | Iron ore is their main export. |
| export | export_vrb | The country decided to export more goods to boost its economy. |
| expose | expose_nou | The journalist published the expose. |
| expose | expose_vrb | The journalist decided to expose the corruption in government. |
| extract | extract_nou | The vanilla extract made the cookies delicious. |
| extract | extract_vrb | They use a special technique to extract oil from the ground. |
| fragment | fragment_nou | The museum displayed a fragment of the ancient artifact. |
| fragment | fragment_vrb | The cohesion of the group started to fragment. |
| frequent | frequent_adj | He was a frequent visitor to the local library. |
| frequent | frequent_vrb | They frequent this pub increasing regularity. |
| graduate | graduate_adj-nou | The graduate student gave a presentation. |
| graduate | graduate_vrb | He was proud to finally graduate from university. |
| house | house_nou | They built a new house on the hilltop. |
| house | house_vrb | We try to house the poor. |
| impact | impact_nou | The impact of the crash was felt throughout the neighborhood. |
| impact | impact_vrb | The meteors impact the moon with some frequency. |
| implant | implant_nou | her body rejected the implant. |
| implant | implant_vrb | The dentist will implant a new tooth next week. |
| implement | implement_nou | He brandished a sharp implement. |
| implement | implement_vrb | They needed to implement new safety measures in the factory. |
| import | import_nou | Textiles are their major import. |
| import | import_vrb | The country needs to import more food to meet demand. |
| incense | incense_nou | The aroma of incense filled the room during the meditation session. |
| incense | incense_vrb | He didn't mean to incense her with his comments. |
| incline | incline_nou | He started up the steep incline. |
| incline | incline_vrb | The road began to incline steeply as they approached the mountain. |
| increase | increase_nou | The fast increase in inflation was surprising. |
| increase | increase_vrb | They decided to increase the budget for the project. |
| increment | increment_nou | The increment in salary was a welcome surprise. |
| increment | increment_vrb | The tally of the participants began to increment upward. |
| initiate | initiate_nou | The initiate was still trying to learn the rules. |
| initiate | initiate_vrb | They wanted to initiate a new policy to improve workplace safety. |
| insert | insert_nou | There was a cardboard insert in the book. |
| insert | insert_vrb | Please insert your card into the ATM machine. |
| instrument | instrument_nou | The violin is a beautiful instrument. |
| instrument | instrument_vrb | He tried to instrument the coup. |
| insult | insult_nou | His words were an unintentional insult to her intelligence. |
| insult | insult_vrb | Please don't insult my intelligence. |
| interchange | interchange_nou | The interchange between cultures enriched their understanding. |
| interchange | interchange_vrb | They decided to interchange their roles for the day. |
| intimate | intimate_adj | They shared an intimate moment by the fireplace. |
| intimate | intimate_vrb | I didn't mean to intimate that you were incompetent. |
| intrigue | intrigue_nou | She couldn't resist the intrigue of the mysterious package. |
| intrigue | intrigue_vrb | The accumulation of evidence started to intrigue me. |
| invalid | invalid_adj | The password you entered is invalid. |
| invalid | invalid_nou | That's the ward for invalids. |
| invite | invite_nou | I already sent him an invite. |
| invite | invite_vrb | They decided to invite her to the party. |
| isolate | isolate_nou | Basque is a language isolate. |
| isolate | isolate | They needed to isolate the problem before it spread. |
| jesus | jesus | Many people believe in the teachings of Jesus. |
| jesus | jesus_es | Jesus Romero is my friend. |
| job | job_bible | He was afflicted like Job in the bible. |
| job | job | Finding a job in this economy is challenging. |
| laminate | laminate_nou | I laid down some new laminate flooring. |
| laminate | laminate_vrb | They chose to laminate the important documents for protection. |
| lead | lead_nou | The cast the statue in lead. |
| lead | lead_nou-vrb | He was chosen to lead the team to victory. |
| learned | learned_adj | I studied the learned tomes. |
| learned | learned_vrb | She learned to swim at the age of five. |
| live | live_adj | We are broadcasting live. |
| live | live_vrb | They decided to live in the countryside for a quieter life. |
| lives | lives_nou | My cat has more than nine lives. |
| lives | lives_vrb | He lives in the city while his brother lives in the suburbs. |
| minute | minute_adj | The minute details of the plan were crucial to its success. |
| minute | minute | Could you spare a minute? |
| misuse | misuse_nou | She felt hurt by the misuse of her trust. |
| misuse | misuse_vrb | He didn't mean to misuse the company's resources. |
| mobile | mobile | The mobile phone revolutionized communication. |
| mobile | mobile_geo | I live in Mobile, Alabama. |
| mobile | mobile_nou-art | The mobile dangled from the ceiling. |
| moderate | moderate_adj-nou | The forum serves as a moderate space for discussion. |
| moderate | moderate_vrb | They decided to moderate their spending habits. |
| moped | moped_nou | She rode her moped to work every day. |
| moped | moped_vrb | He moped around the house after his breakup. |
| mouth | mouth_nou | Please close your mouth while chewing. |
| mouth | mouth_vrb | She tried to mouth the answer to him from the audience. |
| nestle | nestle_nam | I like to eat Nestle Crunch bars. |
| nestle | nestle_vrb | The mother bird will nestle her chicks under her wing. |
| object | object_nou | The main object of the game is to collect all the gems. |
| object | object_vrb | Do you object to my presence here? |
| ornament | ornament_nou | She carefully hung each ornament on the tree. |
| ornament | ornament_vrb | I want to ornament the room festively. |
| overthrow | overthrow_nou | The overthrow of the government was peaceful. |
| overthrow | overthrow_vrb | The citizens staged a protest to overthrow the dictator. |
| pasty | pasty_adj | His pasty skin indicated that he was sick. |
| pasty | pasty_nou | She ate a pasty for lunch. |
| perfect | perfect_adj | The painting was a perfect likeness of the landscape. |
| perfect | perfect_vrb | I want to perfect my sales pitch. |
| perfume | perfume_nou | She wore her favorite perfume for the special occasion. |
| perfume | perfume_vrb | They often perfume the showroom to entice people to buy. |
| permit | permit_nou | You need a permit to park in this area. |
| permit | permit_vrb | We don't permit smoking here. |
| pervert | pervert_nou | He was a known pervert who harassed women on the street. |
| pervert | pervert_vrb | The teacher caught the student trying to pervert the truth. |
| pigment | pigment_nou | The pigment in the paint faded over time. |
| pigment | pigment_vrb | She will pigment the canvas. |
| polish | polish_geo | I like Polish food. |
| polish | polish | He used a cloth to polish his shoes. |
| postulate | postulate_nou | The postulate was in dispute. |
| postulate | postulate_vrb | He couldn't help but postulate about the future. |
| precipitate | precipitate_adj-nou | The chemist collected the precipitate from the beaker. |
| precipitate | precipitate_vrb | The dark clouds precipitate rain. |
| predicate | predicate_nou | The premise of the argument is the predicate of the conclusion. |
| predicate | predicate_vrb | We predicate our success on our hard work. |
| present | present_adj-nou | I gave my brother a present. |
| present | present_vrb | She wrapped the gift and prepared to present it. |
| produce | produce_nou | The produce section of the store was flooded. |
| produce | produce_vrb | Farmers work hard to produce crops every year. |
| progress | progress_nou | She made significant progress in her recovery. |
| progress | progress_vrb | I want to progress to a later stage in the game. |
| project | project_nou | The project was put on hold. |
| project | project_vrb | I project that we will turn a profit in two months. |
| protest | protest_nou | The workers staged a protest outside the factory gates. |
| protest | protest_vrb | The lady doth protest too much. |
| read | read_past | He read the letter with a furrowed brow. |
| read | read_present | She likes to read mystery novels in her free time. |
| rebel | rebel_nou | He was known as a rebel in his youth. |
| rebel | rebel_vrb | They will likely rebel against the ruling order. |
| record | record_nou | I showed him my record collection. |
| record | record_vrb | She made sure to record all her expenses in her budget. |
| recount | recount_nou | The decided to carry out a recount of the votes. |
| recount | recount_vrb | She decided to recount the events of the day to her friend. |
| refund | refund_nou | The store offered a refund for the defective product. |
| refund | refund_vrb | Please refund me my money. |
| refuse | refuse_nou | The refuse trailed behind them. |
| refuse | refuse_vrb | He would refuse to eat his vegetables as a child. |
| reject | reject_nou | I consider him a political reject. |
| reject | reject_vrb | The committee will reject any proposals that don't meet the criteria. |
| rerelease | rerelease | The album is actually a rerelease. |
| rerelease | rerelease_vrb | The company plans to rerelease the classic film in theaters. |
| resume | resume_nou | I updated my resume. |
| resume | resume_vrb | After the break, he will resume his studies. |
| retard | retard_nou | The bully called me a retard. |
| retard | retard_vrb | The teacher didn't want to retard the progress of her students. |
| rodeo | rodeo_geo | I went shopping on Rodeo Drive. |
| rodeo | rodeo | They attended the annual rodeo in their town. |
| row | row_one | I'm putting my ducks in a row. |
| row | row_two | The argument led to a full-on row. |
| sake | sake_jp | She drank sake for the first time at the Japanese restaurant. |
| sake | sake | He brought up the idea for the sake of argument. |
| separate | separate_adj | I have to separate sinks in my bathroom. |
| separate | separate_vrb | They decided to separate after years of marriage. |
| sow | sow_nou | The sow produced a large litter or pigs. |
| sow | sow | please don't sow discord in this chatroom. |
| subject | subject_adj-nou | The professor taught a course on the subject of psychology. |
| subject | subject_vrb | I was subject to numerous experiments. |
| subordinate | subordinate_adj-nou | He was demoted to a subordinate position within the company. |
| subordinate | subordinate_vrb | I subordinate my desires in order to get work done. |
| supplement | supplement_nou | The doctor recommended taking a calcium supplement. |
| supplement | supplement_vrb | We should supplement our diet with more iron. |
| suspect | suspect_adj-nou | The suspect was interrogated. |
| suspect | suspect_vrb | They suspect foul play in the disappearance of the painting. |
| syndicate | syndicate_nou | The syndicate controlled most of the city's underground activities. |
| syndicate | syndicate_vrb | If they syndicate our tv show, we'll make millions. |
| tear | tear_nou | A tear rolled down the child's cheek. |
| tear | tear_vrb | Tear down the wall. |
| transform | transform_nou | He used some sort of mathematical transform. |
| transform | transform | They hoped the therapy would transform his behavior. |
| transplant | transplant_nou | He received a kidney transplant from his sister. |
| transplant | transplant_vrb | They decided to transplant the flowers into larger pots. |
| transport | transport_nou | Public transport is pretty important. |
| transport | transport_vrb | They hired a company to transport their belongings to the new house. |
| upset | upset_nou | The team pulled off the upset. |
| upset | upset_vrb | She was upset by the news of her friend's illness. |
| uses | uses_nou | The uses of this tool are varied and diverse. |
| uses | uses_vrb | She uses a lot of spices in her cooking. |
| use | use_nou | She couldn't find a use for the old vase. |
| use | use_vrb | I use a computer for my job. |
| wind | wind_nou | The wind rustled through the trees on a breezy day. |
| wind | wind_vrb | Let me wind up this clock real quick. |
| winds | winds_nou | The winds of change blew through the community. |
| winds | winds_vrb | If she winds up the winner, i'll be surprised. |
| wound | wound_nou-vrb | He received a wound to his arm during the accident. |
| wound | wound_vrb | They wound their way through the narrow streets of the old city. |
