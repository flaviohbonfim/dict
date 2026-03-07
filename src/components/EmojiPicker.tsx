import { useEffect, useRef, useCallback, useState } from 'react';

interface EmojiData {
  id: string;
  native: string;
  keywords?: string[];
  category?: string;
}

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

// Lista de emojis comuns para o picker
const COMMON_EMOJIS: EmojiData[] = [
  // Smileys
  { id: 'joy', native: '😂', keywords: ['laugh', 'cry', 'happy'], category: 'smileys' },
  { id: 'smile', native: '😄', keywords: ['happy', 'grin'], category: 'smileys' },
  { id: 'smiley', native: '😃', keywords: ['happy', 'open mouth'], category: 'smileys' },
  { id: 'grinning', native: '😀', keywords: ['smile'], category: 'smileys' },
  { id: 'laughing', native: '😆', keywords: ['happy', 'laugh'], category: 'smileys' },
  { id: 'sweat_smile', native: '😅', keywords: ['hot', 'happy'], category: 'smileys' },
  { id: 'rolling_on_the_floor_laughing', native: '🤣', keywords: ['rofl'], category: 'smileys' },
  { id: 'relaxed', native: '☺️', keywords: ['blush'], category: 'smileys' },
  { id: 'blush', native: '😊', keywords: ['proud'], category: 'smileys' },
  { id: 'innocent', native: '😇', keywords: ['angel'], category: 'smileys' },
  { id: 'slightly_smiling_face', native: '🙂', keywords: ['smile'], category: 'smileys' },
  { id: 'upside_down_face', native: '🙃', keywords: ['silly'], category: 'smileys' },
  { id: 'wink', native: '😉', keywords: ['flirt'], category: 'smileys' },
  { id: 'relieved', native: '😌', keywords: ['calm'], category: 'smileys' },
  { id: 'heart_eyes', native: '😍', keywords: ['love', 'crush'], category: 'smileys' },
  { id: 'smiling_face_with_3_hearts', native: '🥰', keywords: ['love'], category: 'smileys' },
  { id: 'kissing_heart', native: '😘', keywords: ['flirt'], category: 'smileys' },
  { id: 'kissing', native: '😗', keywords: ['love'], category: 'smileys' },
  { id: 'kissing_smiling_eyes', native: '😙', keywords: ['love'], category: 'smileys' },
  { id: 'kissing_closed_eyes', native: '😚', keywords: ['love'], category: 'smileys' },
  { id: 'yum', native: '😋', keywords: ['delicious'], category: 'smileys' },
  { id: 'stuck_out_tongue_winking_eye', native: '😜', keywords: ['prank', 'silly'], category: 'smileys' },
  { id: 'stuck_out_tongue_closed_eyes', native: '😝', keywords: ['prank'], category: 'smileys' },
  { id: 'stuck_out_tongue', native: '😛', keywords: ['prank'], category: 'smileys' },
  { id: 'zany_face', native: '🤪', keywords: ['crazy', 'wild'], category: 'smileys' },
  { id: 'face_with_raised_eyebrow', native: '🤨', keywords: ['skeptical'], category: 'smileys' },
  { id: 'monocle_face', native: '🧐', keywords: ['fancy', 'serious'], category: 'smileys' },
  { id: 'nerd_face', native: '🤓', keywords: ['geek', 'smart'], category: 'smileys' },
  { id: 'sunglasses', native: '😎', keywords: ['cool'], category: 'smileys' },
  { id: 'star_struck', native: '🤩', keywords: ['excited'], category: 'smileys' },
  { id: 'partying_face', native: '🥳', keywords: ['celebration'], category: 'smileys' },
  { id: 'smirk', native: '😏', keywords: ['smug'], category: 'smileys' },
  { id: 'unamused', native: '😒', keywords: ['meh'], category: 'smileys' },
  { id: 'disappointed', native: '😞', keywords: ['sad'], category: 'smileys' },
  { id: 'pensive', native: '😔', keywords: ['sad', 'thoughtful'], category: 'smileys' },
  { id: 'worried', native: '😟', keywords: ['nervous'], category: 'smileys' },
  { id: 'confused', native: '😕', keywords: ['puzzled'], category: 'smileys' },
  { id: 'slightly_frowning_face', native: '🙁', keywords: ['sad'], category: 'smileys' },
  { id: 'frowning_face', native: '☹️', keywords: ['sad'], category: 'smileys' },
  { id: 'persevere', native: '😣', keywords: ['struggle'], category: 'smileys' },
  { id: 'confounded', native: '😖', keywords: ['frustrated'], category: 'smileys' },
  { id: 'tired_face', native: '😫', keywords: ['exhausted'], category: 'smileys' },
  { id: 'weary', native: '😩', keywords: ['tired'], category: 'smileys' },
  { id: 'pleading_face', native: '🥺', keywords: ['beg', 'puppy eyes'], category: 'smileys' },
  { id: 'cry', native: '😢', keywords: ['sad', 'tear'], category: 'smileys' },
  { id: 'sob', native: '😭', keywords: ['sad', 'cry'], category: 'smileys' },
  { id: 'triumph', native: '😤', keywords: ['angry', 'proud'], category: 'smileys' },
  { id: 'angry', native: '😠', keywords: ['mad'], category: 'smileys' },
  { id: 'rage', native: '😡', keywords: ['angry', 'mad'], category: 'smileys' },
  { id: 'exploding_head', native: '🤯', keywords: ['mind blown', 'shocked'], category: 'smileys' },
  { id: 'flushed', native: '😳', keywords: ['embarrassed'], category: 'smileys' },
  { id: 'hot_face', native: '🥵', keywords: ['heat', 'sweat'], category: 'smileys' },
  { id: 'cold_face', native: '🥶', keywords: ['freezing'], category: 'smileys' },
  { id: 'scream', native: '😱', keywords: ['fear', 'shock'], category: 'smileys' },
  { id: 'fearful', native: '😨', keywords: ['scared'], category: 'smileys' },
  { id: 'cold_sweat', native: '😰', keywords: ['nervous'], category: 'smileys' },
  { id: 'sweat', native: '😓', keywords: ['tired'], category: 'smileys' },
  { id: 'disappointed_relieved', native: '😥', keywords: ['phew'], category: 'smileys' },
  { id: 'hugging_face', native: '🤗', keywords: ['hug'], category: 'smileys' },
  { id: 'thinking', native: '🤔', keywords: ['think', 'hmm'], category: 'smileys' },
  { id: 'face_with_hand_over_mouth', native: '🤭', keywords: ['oops', 'giggle'], category: 'smileys' },
  { id: 'yawning_face', native: '🥱', keywords: ['tired', 'sleepy'], category: 'smileys' },
  { id: 'shushing_face', native: '🤫', keywords: ['quiet', 'shh'], category: 'smileys' },
  { id: 'lying_face', native: '🤥', keywords: ['lie', 'pinocchio'], category: 'smileys' },
  { id: 'no_mouth', native: '😶', keywords: ['silent'], category: 'smileys' },
  { id: 'neutral_face', native: '😐', keywords: ['meh'], category: 'smileys' },
  { id: 'expressionless', native: '😑', keywords: ['blank'], category: 'smileys' },
  { id: 'grimacing', native: '😬', keywords: ['awkward'], category: 'smileys' },
  { id: 'rolling_eyes', native: '🙄', keywords: ['whatever'], category: 'smileys' },
  { id: 'hushed', native: '😯', keywords: ['surprised'], category: 'smileys' },
  { id: 'frowning', native: '😦', keywords: ['surprised'], category: 'smileys' },
  { id: 'anguished', native: '😧', keywords: ['stunned'], category: 'smileys' },
  { id: 'open_mouth', native: '😮', keywords: ['surprised'], category: 'smileys' },
  { id: 'astonished', native: '😲', keywords: ['amazed'], category: 'smileys' },
  { id: 'sleeping', native: '😴', keywords: ['zzz'], category: 'smileys' },
  { id: 'drooling_face', native: '🤤', keywords: ['drool'], category: 'smileys' },
  { id: 'sleepy', native: '😪', keywords: ['tired'], category: 'smileys' },
  { id: 'dizzy_face', native: '😵', keywords: ['dead'], category: 'smileys' },
  { id: 'zipper_mouth_face', native: '🤐', keywords: ['sealed lips'], category: 'smileys' },
  { id: 'woozy_face', native: '🥴', keywords: ['drunk', 'tipsy'], category: 'smileys' },
  { id: 'nauseated_face', native: '🤢', keywords: ['sick', 'vomit'], category: 'smileys' },
  { id: 'face_vomiting', native: '🤮', keywords: ['vomit', 'sick'], category: 'smileys' },
  { id: 'sneezing_face', native: '🤧', keywords: ['achoo', 'sick'], category: 'smileys' },
  { id: 'mask', native: '😷', keywords: ['sick', 'covid'], category: 'smileys' },
  { id: 'face_with_thermometer', native: '🤒', keywords: ['sick', 'fever'], category: 'smileys' },
  { id: 'face_with_head_bandage', native: '🤕', keywords: ['injured'], category: 'smileys' },
  { id: 'money_mouth_face', native: '🤑', keywords: ['rich'], category: 'smileys' },
  { id: 'cowboy_hat_face', native: '🤠', keywords: ['western'], category: 'smileys' },
  { id: 'smiling_imp', native: '😈', keywords: ['devil', 'evil'], category: 'smileys' },
  { id: 'imp', native: '👿', keywords: ['angry devil'], category: 'smileys' },
  { id: 'japanese_ogre', native: '👹', keywords: ['monster'], category: 'smileys' },
  { id: 'japanese_goblin', native: '👺', keywords: ['tengu'], category: 'smileys' },
  { id: 'skull', native: '💀', keywords: ['dead', 'death'], category: 'smileys' },
  { id: 'ghost', native: '👻', keywords: ['halloween'], category: 'smileys' },
  { id: 'alien', native: '👽', keywords: ['ufo'], category: 'smileys' },
  { id: 'robot', native: '🤖', keywords: ['ai', 'bot'], category: 'smileys' },
  { id: 'poop', native: '💩', keywords: ['shit', 'crap'], category: 'smileys' },
  
  // Hearts
  { id: 'heart', native: '❤️', keywords: ['love'], category: 'smileys' },
  { id: 'blue_heart', native: '💙', keywords: ['love'], category: 'smileys' },
  { id: 'green_heart', native: '💚', keywords: ['love'], category: 'smileys' },
  { id: 'yellow_heart', native: '💛', keywords: ['love'], category: 'smileys' },
  { id: 'orange_heart', native: '🧡', keywords: ['love'], category: 'smileys' },
  { id: 'purple_heart', native: '💜', keywords: ['love'], category: 'smileys' },
  { id: 'black_heart', native: '🖤', keywords: ['love', 'evil'], category: 'smileys' },
  { id: 'white_heart', native: '🤍', keywords: ['love', 'pure'], category: 'smileys' },
  { id: 'broken_heart', native: '💔', keywords: ['sad', 'breakup'], category: 'smileys' },
  { id: 'heartpulse', native: '💗', keywords: ['love', 'nervous'], category: 'smileys' },
  { id: 'heartbeat', native: '💓', keywords: ['love'], category: 'smileys' },
  { id: 'two_hearts', native: '💕', keywords: ['love'], category: 'smileys' },
  { id: 'revolving_hearts', native: '💞', keywords: ['love'], category: 'smileys' },
  { id: 'sparkling_heart', native: '💖', keywords: ['love', 'excited'], category: 'smileys' },
  { id: 'gift_heart', native: '💝', keywords: ['love', 'gift'], category: 'smileys' },
  { id: 'love_letter', native: '💌', keywords: ['love', 'email'], category: 'smileys' },
  { id: 'kiss', native: '💋', keywords: ['lipstick'], category: 'smileys' },
  
  // Gestures
  { id: 'wave', native: '👋', keywords: ['hello', 'bye'], category: 'people' },
  { id: 'raised_hand', native: '✋', keywords: ['stop', 'highfive'], category: 'people' },
  { id: 'vulcan_salute', native: '🖖', keywords: ['spock', 'star trek'], category: 'people' },
  { id: 'ok_hand', native: '👌', keywords: ['perfect'], category: 'people' },
  { id: 'pinched_fingers', native: '🤌', keywords: ['italian', 'chef kiss'], category: 'people' },
  { id: 'pinching_hand', native: '🤏', keywords: ['small', 'tiny'], category: 'people' },
  { id: 'v', native: '✌️', keywords: ['peace', 'victory'], category: 'people' },
  { id: 'crossed_fingers', native: '🤞', keywords: ['luck', 'hope'], category: 'people' },
  { id: 'love_you_gesture', native: '🤟', keywords: ['ily'], category: 'people' },
  { id: 'metal', native: '🤘', keywords: ['rock', 'metal'], category: 'people' },
  { id: 'call_me_hand', native: '🤙', keywords: ['hang loose'], category: 'people' },
  { id: 'point_left', native: '👈', keywords: ['direction'], category: 'people' },
  { id: 'point_right', native: '👉', keywords: ['direction'], category: 'people' },
  { id: 'point_up_2', native: '👆', keywords: ['direction'], category: 'people' },
  { id: 'point_down', native: '👇', keywords: ['direction'], category: 'people' },
  { id: 'point_up', native: '☝️', keywords: ['direction'], category: 'people' },
  { id: 'thumbsup', native: '👍', keywords: ['like', 'approve'], category: 'people' },
  { id: 'thumbsdown', native: '👎', keywords: ['dislike'], category: 'people' },
  { id: 'fist_raised', native: '✊', keywords: ['power', 'solidarity'], category: 'people' },
  { id: 'fist_oncoming', native: '👊', keywords: ['punch', 'bro'], category: 'people' },
  { id: 'clap', native: '👏', keywords: ['applause', 'praise'], category: 'people' },
  { id: 'raised_hands', native: '🙌', keywords: ['praise', 'hooray'], category: 'people' },
  { id: 'open_hands', native: '👐', keywords: ['hug'], category: 'people' },
  { id: 'handshake', native: '🤝', keywords: ['deal', 'agreement'], category: 'people' },
  { id: 'pray', native: '🙏', keywords: ['please', 'thanks', 'namaste'], category: 'people' },
  { id: 'muscle', native: '💪', keywords: ['strong', 'workout'], category: 'people' },
  { id: 'brain', native: '🧠', keywords: ['smart', 'mind'], category: 'people' },
  { id: 'eyes', native: '👀', keywords: ['looking', 'watch'], category: 'people' },
  
  // Animals
  { id: 'dog', native: '🐶', keywords: ['pet', 'puppy'], category: 'animals' },
  { id: 'cat', native: '🐱', keywords: ['pet', 'kitten'], category: 'animals' },
  { id: 'mouse', native: '🐭', keywords: ['rodent'], category: 'animals' },
  { id: 'hamster', native: '🐹', keywords: ['pet'], category: 'animals' },
  { id: 'rabbit', native: '🐰', keywords: ['bunny', 'pet'], category: 'animals' },
  { id: 'fox_face', native: '🦊', keywords: ['animal'], category: 'animals' },
  { id: 'bear', native: '🐻', keywords: ['animal'], category: 'animals' },
  { id: 'panda_face', native: '🐼', keywords: ['animal'], category: 'animals' },
  { id: 'koala', native: '🐨', keywords: ['animal'], category: 'animals' },
  { id: 'tiger', native: '🐯', keywords: ['animal', 'cat'], category: 'animals' },
  { id: 'lion', native: '🦁', keywords: ['animal', 'king'], category: 'animals' },
  { id: 'cow', native: '🐮', keywords: ['animal'], category: 'animals' },
  { id: 'pig', native: '🐷', keywords: ['animal'], category: 'animals' },
  { id: 'frog', native: '🐸', keywords: ['animal', 'toad'], category: 'animals' },
  { id: 'monkey_face', native: '🐵', keywords: ['animal'], category: 'animals' },
  { id: 'see_no_evil', native: '🙈', keywords: ['monkey', 'blind'], category: 'animals' },
  { id: 'hear_no_evil', native: '🙉', keywords: ['monkey', 'deaf'], category: 'animals' },
  { id: 'speak_no_evil', native: '🙊', keywords: ['monkey', 'mute'], category: 'animals' },
  { id: 'chicken', native: '🐔', keywords: ['bird', 'hen'], category: 'animals' },
  { id: 'penguin', native: '🐧', keywords: ['bird'], category: 'animals' },
  { id: 'bird', native: '🐦', keywords: ['animal'], category: 'animals' },
  { id: 'duck', native: '🦆', keywords: ['bird'], category: 'animals' },
  { id: 'eagle', native: '🦅', keywords: ['bird'], category: 'animals' },
  { id: 'owl', native: '🦉', keywords: ['bird', 'wise'], category: 'animals' },
  { id: 'bat', native: '🦇', keywords: ['animal', 'vampire'], category: 'animals' },
  { id: 'wolf', native: '🐺', keywords: ['animal'], category: 'animals' },
  { id: 'horse', native: '🐴', keywords: ['animal'], category: 'animals' },
  { id: 'unicorn', native: '🦄', keywords: ['animal', 'magic'], category: 'animals' },
  { id: 'bee', native: '🐝', keywords: ['insect', 'honey'], category: 'animals' },
  { id: 'bug', native: '🐛', keywords: ['insect'], category: 'animals' },
  { id: 'butterfly', native: '🦋', keywords: ['insect'], category: 'animals' },
  { id: 'snail', native: '🐌', keywords: ['slow'], category: 'animals' },
  { id: 'shell', native: '🐚', keywords: ['sea'], category: 'animals' },
  { id: 'beetle', native: '🐞', keywords: ['ladybug', 'insect'], category: 'animals' },
  { id: 'ant', native: '🐜', keywords: ['insect'], category: 'animals' },
  { id: 'mosquito', native: '🦟', keywords: ['insect', 'bug'], category: 'animals' },
  { id: 'cricket', native: '🦗', keywords: ['insect'], category: 'animals' },
  { id: 'spider', native: '🕷️', keywords: ['insect'], category: 'animals' },
  { id: 'spider_web', native: '🕸️', keywords: ['spider'], category: 'animals' },
  { id: 'turtle', native: '🐢', keywords: ['slow', 'animal'], category: 'animals' },
  { id: 'snake', native: '🐍', keywords: ['animal', 'reptile'], category: 'animals' },
  { id: 'lizard', native: '🦎', keywords: ['reptile'], category: 'animals' },
  { id: 't_rex', native: '🦖', keywords: ['dinosaur'], category: 'animals' },
  { id: 'sauropod', native: '🦕', keywords: ['dinosaur'], category: 'animals' },
  { id: 'octopus', native: '🐙', keywords: ['sea', 'animal'], category: 'animals' },
  { id: 'squid', native: '🦑', keywords: ['sea', 'animal'], category: 'animals' },
  { id: 'shrimp', native: '🦐', keywords: ['sea', 'food'], category: 'animals' },
  { id: 'lobster', native: '🦞', keywords: ['sea', 'food'], category: 'animals' },
  { id: 'oyster', native: '🦪', keywords: ['sea', 'food'], category: 'animals' },
  { id: 'tropical_fish', native: '🐠', keywords: ['fish', 'sea'], category: 'animals' },
  { id: 'fish', native: '🐟', keywords: ['sea', 'food'], category: 'animals' },
  { id: 'blowfish', native: '🐡', keywords: ['fish', 'sea'], category: 'animals' },
  { id: 'shark', native: '🦈', keywords: ['fish', 'sea', 'dangerous'], category: 'animals' },
  { id: 'whale', native: '🐳', keywords: ['sea', 'animal'], category: 'animals' },
  { id: 'dolphin', native: '🐬', keywords: ['sea', 'animal'], category: 'animals' },
  { id: 'seal', native: '🦭', keywords: ['sea', 'animal'], category: 'animals' },
  { id: 'crocodile', native: '🐊', keywords: ['reptile', 'animal'], category: 'animals' },
  { id: 'tiger2', native: '🐅', keywords: ['animal'], category: 'animals' },
  { id: 'leopard', native: '🐆', keywords: ['animal', 'cat'], category: 'animals' },
  { id: 'zebra', native: '🦓', keywords: ['animal'], category: 'animals' },
  { id: 'gorilla', native: '🦍', keywords: ['animal', 'monkey'], category: 'animals' },
  { id: 'orangutan', native: '🦧', keywords: ['animal', 'monkey'], category: 'animals' },
  { id: 'elephant', native: '🐘', keywords: ['animal'], category: 'animals' },
  { id: 'hippopotamus', native: '🦛', keywords: ['animal'], category: 'animals' },
  { id: 'rhinoceros', native: '🦏', keywords: ['animal'], category: 'animals' },
  { id: 'camel', native: '🐪', keywords: ['desert', 'animal'], category: 'animals' },
  { id: 'giraffe', native: '🦒', keywords: ['animal'], category: 'animals' },
  { id: 'kangaroo', native: '🦘', keywords: ['animal', 'australia'], category: 'animals' },
  { id: 'water_buffalo', native: '🐃', keywords: ['animal'], category: 'animals' },
  { id: 'ox', native: '🐂', keywords: ['animal'], category: 'animals' },
  { id: 'cow2', native: '🐄', keywords: ['animal'], category: 'animals' },
  { id: 'racehorse', native: '🐎', keywords: ['animal', 'fast'], category: 'animals' },
  { id: 'pig2', native: '🐖', keywords: ['animal'], category: 'animals' },
  { id: 'ram', native: '🐏', keywords: ['animal'], category: 'animals' },
  { id: 'sheep', native: '🐑', keywords: ['animal'], category: 'animals' },
  { id: 'llama', native: '🦙', keywords: ['animal'], category: 'animals' },
  { id: 'goat', native: '🐐', keywords: ['animal'], category: 'animals' },
  { id: 'deer', native: '🦌', keywords: ['animal'], category: 'animals' },
  { id: 'dog2', native: '🐕', keywords: ['pet', 'animal'], category: 'animals' },
  { id: 'poodle', native: '🐩', keywords: ['dog', 'pet'], category: 'animals' },
  { id: 'guide_dog', native: '🦮', keywords: ['dog', 'blind', 'service'], category: 'animals' },
  { id: 'service_dog', native: '🐕‍🦺', keywords: ['dog', 'service'], category: 'animals' },
  { id: 'cat2', native: '🐈', keywords: ['pet', 'animal'], category: 'animals' },
  { id: 'rooster', native: '🐓', keywords: ['chicken', 'bird'], category: 'animals' },
  { id: 'turkey', native: '🦃', keywords: ['bird', 'thanksgiving'], category: 'animals' },
  { id: 'peacock', native: '🦚', keywords: ['bird'], category: 'animals' },
  { id: 'parrot', native: '🦜', keywords: ['bird', 'pirate'], category: 'animals' },
  { id: 'swan', native: '🦢', keywords: ['bird', 'elegant'], category: 'animals' },
  { id: 'flamingo', native: '🦩', keywords: ['bird'], category: 'animals' },
  { id: 'rabbit2', native: '🐇', keywords: ['pet', 'animal'], category: 'animals' },
  { id: 'raccoon', native: '🦝', keywords: ['animal'], category: 'animals' },
  { id: 'skunk', native: '🦨', keywords: ['animal', 'stink'], category: 'animals' },
  { id: 'sloth', native: '🦥', keywords: ['animal', 'slow'], category: 'animals' },
  { id: 'otter', native: '🦦', keywords: ['animal'], category: 'animals' },
  
  // Food
  { id: 'grapes', native: '🍇', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'melon', native: '🍈', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'watermelon', native: '🍉', keywords: ['fruit', 'food', 'summer'], category: 'food' },
  { id: 'tangerine', native: '🍊', keywords: ['fruit', 'food', 'orange'], category: 'food' },
  { id: 'lemon', native: '🍋', keywords: ['fruit', 'food', 'citrus'], category: 'food' },
  { id: 'banana', native: '🍌', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'pineapple', native: '🍍', keywords: ['fruit', 'food', 'tropical'], category: 'food' },
  { id: 'mango', native: '🥭', keywords: ['fruit', 'food', 'tropical'], category: 'food' },
  { id: 'apple', native: '🍎', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'green_apple', native: '🍏', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'pear', native: '🍐', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'peach', native: '🍑', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'cherries', native: '🍒', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'strawberry', native: '🍓', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'blueberries', native: '🫐', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'kiwi_fruit', native: '🥝', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'tomato', native: '🍅', keywords: ['fruit', 'vegetable', 'food'], category: 'food' },
  { id: 'olive', native: '🫒', keywords: ['fruit', 'food'], category: 'food' },
  { id: 'coconut', native: '🥥', keywords: ['fruit', 'food', 'tropical'], category: 'food' },
  { id: 'avocado', native: '🥑', keywords: ['fruit', 'food', 'healthy'], category: 'food' },
  { id: 'eggplant', native: '🍆', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'potato', native: '🥔', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'carrot', native: '🥕', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'corn', native: '🌽', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'hot_pepper', native: '🌶️', keywords: ['vegetable', 'spicy', 'food'], category: 'food' },
  { id: 'bell_pepper', native: '🫑', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'cucumber', native: '🥒', keywords: ['vegetable', 'food', 'pickle'], category: 'food' },
  { id: 'leafy_green', native: '🥬', keywords: ['vegetable', 'food', 'salad'], category: 'food' },
  { id: 'broccoli', native: '🥦', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'garlic', native: '🧄', keywords: ['vegetable', 'food', 'flavor'], category: 'food' },
  { id: 'onion', native: '🧅', keywords: ['vegetable', 'food', 'flavor'], category: 'food' },
  { id: 'mushroom', native: '🍄', keywords: ['vegetable', 'food'], category: 'food' },
  { id: 'peanuts', native: '🥜', keywords: ['nut', 'food'], category: 'food' },
  { id: 'chestnut', native: '🌰', keywords: ['nut', 'food'], category: 'food' },
  { id: 'bread', native: '🍞', keywords: ['food', 'carb'], category: 'food' },
  { id: 'croissant', native: '🥐', keywords: ['food', 'french', 'breakfast'], category: 'food' },
  { id: 'baguette_bread', native: '🥖', keywords: ['food', 'french'], category: 'food' },
  { id: 'flatbread', native: '🫓', keywords: ['food'], category: 'food' },
  { id: 'pretzel', native: '🥨', keywords: ['food', 'german'], category: 'food' },
  { id: 'bagel', native: '🥯', keywords: ['food', 'breakfast'], category: 'food' },
  { id: 'pancakes', native: '🥞', keywords: ['food', 'breakfast'], category: 'food' },
  { id: 'waffle', native: '🧇', keywords: ['food', 'breakfast'], category: 'food' },
  { id: 'cheese', native: '🧀', keywords: ['food', 'dairy'], category: 'food' },
  { id: 'meat_on_bone', native: '🍖', keywords: ['food', 'meat'], category: 'food' },
  { id: 'poultry_leg', native: '🍗', keywords: ['food', 'meat', 'chicken'], category: 'food' },
  { id: 'cut_of_meat', native: '🥩', keywords: ['food', 'meat', 'steak'], category: 'food' },
  { id: 'bacon', native: '🥓', keywords: ['food', 'meat', 'breakfast'], category: 'food' },
  { id: 'hamburger', native: '🍔', keywords: ['food', 'fast food'], category: 'food' },
  { id: 'fries', native: '🍟', keywords: ['food', 'fast food'], category: 'food' },
  { id: 'pizza', native: '🍕', keywords: ['food', 'italian'], category: 'food' },
  { id: 'hotdog', native: '🌭', keywords: ['food', 'fast food'], category: 'food' },
  { id: 'sandwich', native: '🥪', keywords: ['food'], category: 'food' },
  { id: 'taco', native: '🌮', keywords: ['food', 'mexican'], category: 'food' },
  { id: 'burrito', native: '🌯', keywords: ['food', 'mexican'], category: 'food' },
  { id: 'tamale', native: '🫔', keywords: ['food', 'mexican'], category: 'food' },
  { id: 'stuffed_flatbread', native: '🥙', keywords: ['food', 'mediterranean'], category: 'food' },
  { id: 'falafel', native: '🧆', keywords: ['food', 'mediterranean'], category: 'food' },
  { id: 'egg', native: '🥚', keywords: ['food', 'breakfast'], category: 'food' },
  { id: 'fried_egg', native: '🍳', keywords: ['food', 'breakfast', 'cooking'], category: 'food' },
  { id: 'shallow_pan_of_food', native: '🥘', keywords: ['food', 'paella', 'curry'], category: 'food' },
  { id: 'stew', native: '🍲', keywords: ['food', 'soup'], category: 'food' },
  { id: 'fondue', native: '🫕', keywords: ['food', 'cheese', 'swiss'], category: 'food' },
  { id: 'bowl_with_spoon', native: '🥣', keywords: ['food', 'breakfast', 'cereal'], category: 'food' },
  { id: 'green_salad', native: '🥗', keywords: ['food', 'healthy'], category: 'food' },
  { id: 'popcorn', native: '🍿', keywords: ['food', 'snack', 'movie'], category: 'food' },
  { id: 'butter', native: '🧈', keywords: ['food', 'dairy'], category: 'food' },
  { id: 'salt', native: '🧂', keywords: ['food', 'seasoning'], category: 'food' },
  { id: 'canned_food', native: '🥫', keywords: ['food'], category: 'food' },
  { id: 'bento', native: '🍱', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'rice_cracker', native: '🍘', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'rice_ball', native: '🍙', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'rice', native: '🍚', keywords: ['food', 'asian'], category: 'food' },
  { id: 'curry', native: '🍛', keywords: ['food', 'indian', 'spicy'], category: 'food' },
  { id: 'ramen', native: '🍜', keywords: ['food', 'japanese', 'noodles'], category: 'food' },
  { id: 'spaghetti', native: '🍝', keywords: ['food', 'italian', 'pasta'], category: 'food' },
  { id: 'sweet_potato', native: '🍠', keywords: ['food', 'vegetable'], category: 'food' },
  { id: 'oden', native: '🍢', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'sushi', native: '🍣', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'fried_shrimp', native: '🍤', keywords: ['food', 'japanese', 'tempura'], category: 'food' },
  { id: 'fish_cake', native: '🍥', keywords: ['food', 'japanese'], category: 'food' },
  { id: 'moon_cake', native: '🥮', keywords: ['food', 'chinese'], category: 'food' },
  { id: 'dango', native: '🍡', keywords: ['food', 'japanese', 'dessert'], category: 'food' },
  { id: 'dumpling', native: '🥟', keywords: ['food', 'chinese', 'gyoza'], category: 'food' },
  { id: 'fortune_cookie', native: '🥠', keywords: ['food', 'chinese'], category: 'food' },
  { id: 'takeout_box', native: '🥡', keywords: ['food', 'chinese', 'delivery'], category: 'food' },
  { id: 'crab', native: '🦀', keywords: ['food', 'seafood'], category: 'food' },
  { id: 'icecream', native: '🍦', keywords: ['food', 'dessert', 'ice cream'], category: 'food' },
  { id: 'shaved_ice', native: '🍧', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'ice_cream', native: '🍨', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'doughnut', native: '🍩', keywords: ['food', 'dessert', 'sweet'], category: 'food' },
  { id: 'cookie', native: '🍪', keywords: ['food', 'dessert', 'sweet'], category: 'food' },
  { id: 'birthday', native: '🎂', keywords: ['food', 'dessert', 'celebration'], category: 'food' },
  { id: 'cake', native: '🍰', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'cupcake', native: '🧁', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'pie', native: '🥧', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'chocolate_bar', native: '🍫', keywords: ['food', 'dessert', 'sweet'], category: 'food' },
  { id: 'candy', native: '🍬', keywords: ['food', 'dessert', 'sweet'], category: 'food' },
  { id: 'lollipop', native: '🍭', keywords: ['food', 'dessert', 'sweet'], category: 'food' },
  { id: 'custard', native: '🍮', keywords: ['food', 'dessert'], category: 'food' },
  { id: 'honey_pot', native: '🍯', keywords: ['food', 'sweet'], category: 'food' },
  { id: 'baby_bottle', native: '🍼', keywords: ['food', 'milk'], category: 'food' },
  { id: 'milk_glass', native: '🥛', keywords: ['food', 'drink'], category: 'food' },
  { id: 'coffee', native: '☕', keywords: ['drink', 'caffeine', 'hot'], category: 'food' },
  { id: 'teapot', native: '🫖', keywords: ['drink', 'tea'], category: 'food' },
  { id: 'tea', native: '🍵', keywords: ['drink', 'green', 'healthy'], category: 'food' },
  { id: 'sake', native: '🍶', keywords: ['drink', 'alcohol', 'japanese'], category: 'food' },
  { id: 'champagne', native: '🍾', keywords: ['drink', 'alcohol', 'celebration'], category: 'food' },
  { id: 'wine_glass', native: '🍷', keywords: ['drink', 'alcohol'], category: 'food' },
  { id: 'cocktail', native: '🍸', keywords: ['drink', 'alcohol'], category: 'food' },
  { id: 'tropical_drink', native: '🍹', keywords: ['drink', 'alcohol', 'vacation'], category: 'food' },
  { id: 'beer', native: '🍺', keywords: ['drink', 'alcohol'], category: 'food' },
  { id: 'beers', native: '🍻', keywords: ['drink', 'alcohol', 'cheers'], category: 'food' },
  { id: 'clinking_glasses', native: '🥂', keywords: ['drink', 'alcohol', 'cheers'], category: 'food' },
  { id: 'tumbler_glass', native: '🥃', keywords: ['drink', 'alcohol', 'whiskey'], category: 'food' },
  { id: 'cup_with_straw', native: '🥤', keywords: ['drink', 'soda'], category: 'food' },
  { id: 'bubble_tea', native: '🧋', keywords: ['drink', 'taiwan', 'boba'], category: 'food' },
  { id: 'beverage_box', native: '🧃', keywords: ['drink', 'juice'], category: 'food' },
  { id: 'mate', native: '🧉', keywords: ['drink', 'tea', 'argentina'], category: 'food' },
  { id: 'ice_cube', native: '🧊', keywords: ['cold', 'ice'], category: 'food' },
  
  // Activities
  { id: 'soccer', native: '⚽', keywords: ['sports', 'football'], category: 'activities' },
  { id: 'basketball', native: '🏀', keywords: ['sports', 'nba'], category: 'activities' },
  { id: 'football', native: '🏈', keywords: ['sports', 'nfl'], category: 'activities' },
  { id: 'baseball', native: '⚾', keywords: ['sports', 'mlb'], category: 'activities' },
  { id: 'softball', native: '🥎', keywords: ['sports'], category: 'activities' },
  { id: 'tennis', native: '🎾', keywords: ['sports'], category: 'activities' },
  { id: 'volleyball', native: '🏐', keywords: ['sports'], category: 'activities' },
  { id: 'rugby_football', native: '🏉', keywords: ['sports'], category: 'activities' },
  { id: 'flying_disc', native: '🥏', keywords: ['sports', 'frisbee'], category: 'activities' },
  { id: '8ball', native: '🎱', keywords: ['pool', 'billiards'], category: 'activities' },
  { id: 'ping_pong', native: '🏓', keywords: ['sports', 'table tennis'], category: 'activities' },
  { id: 'badminton', native: '🏸', keywords: ['sports'], category: 'activities' },
  { id: 'hockey', native: '🏒', keywords: ['sports', 'nhl'], category: 'activities' },
  { id: 'field_hockey', native: '🏑', keywords: ['sports'], category: 'activities' },
  { id: 'lacrosse', native: '🥍', keywords: ['sports'], category: 'activities' },
  { id: 'cricket_game', native: '🏏', keywords: ['sports'], category: 'activities' },
  { id: 'golf', native: '⛳', keywords: ['sports'], category: 'activities' },
  { id: 'bow_and_arrow', native: '🏹', keywords: ['sports', 'archery'], category: 'activities' },
  { id: 'fishing_pole_and_fish', native: '🎣', keywords: ['hobby', 'outdoor'], category: 'activities' },
  { id: 'diving_mask', native: '🤿', keywords: ['sports', 'scuba'], category: 'activities' },
  { id: 'running_shirt_with_sash', native: '🎽', keywords: ['sports', 'marathon'], category: 'activities' },
  { id: 'ski', native: '🎿', keywords: ['sports', 'winter', 'snow'], category: 'activities' },
  { id: 'sled', native: '🛷', keywords: ['sports', 'winter', 'snow'], category: 'activities' },
  { id: 'curling_stone', native: '🥌', keywords: ['sports', 'winter'], category: 'activities' },
  { id: 'dart', native: '🎯', keywords: ['game', 'target'], category: 'activities' },
  { id: 'yo_yo', native: '🪀', keywords: ['toy', 'game'], category: 'activities' },
  { id: 'kite', native: '🪁', keywords: ['toy', 'outdoor'], category: 'activities' },
  { id: 'video_game', native: '🎮', keywords: ['game', 'gaming'], category: 'activities' },
  { id: 'slot_machine', native: '🎰', keywords: ['game', 'casino', 'gambling'], category: 'activities' },
  { id: 'game_die', native: '🎲', keywords: ['game', 'dice', 'gambling'], category: 'activities' },
  { id: 'jigsaw', native: '🧩', keywords: ['game', 'puzzle'], category: 'activities' },
  { id: 'teddy_bear', native: '🧸', keywords: ['toy', 'cute'], category: 'activities' },
  { id: 'chess_pawn', native: '♟️', keywords: ['game', 'strategy'], category: 'activities' },
  { id: 'performing_arts', native: '🎭', keywords: ['theater', 'drama'], category: 'activities' },
  { id: 'framed_picture', native: '🖼️', keywords: ['art', 'photo'], category: 'activities' },
  { id: 'art', native: '🎨', keywords: ['paint', 'design'], category: 'activities' },
  { id: 'thread', native: '🧵', keywords: ['sewing', 'craft'], category: 'activities' },
  { id: 'sewing_needle', native: '🪡', keywords: ['sewing', 'craft'], category: 'activities' },
  { id: 'yarn', native: '🧶', keywords: ['knitting', 'craft'], category: 'activities' },
  { id: 'knot', native: '🪢', keywords: ['rope', 'tie'], category: 'activities' },
  
  // Travel
  { id: 'earth_africa', native: '🌍', keywords: ['world', 'globe'], category: 'travel' },
  { id: 'earth_americas', native: '🌎', keywords: ['world', 'globe'], category: 'travel' },
  { id: 'earth_asia', native: '🌏', keywords: ['world', 'globe'], category: 'travel' },
  { id: 'globe_with_meridians', native: '🌐', keywords: ['world', 'internet'], category: 'travel' },
  { id: 'world_map', native: '🗺️', keywords: ['travel', 'location'], category: 'travel' },
  { id: 'japan', native: '🗾', keywords: ['country', 'map'], category: 'travel' },
  { id: 'compass', native: '🧭', keywords: ['travel', 'navigation'], category: 'travel' },
  { id: 'mountain_snow', native: '🏔️', keywords: ['nature', 'winter'], category: 'travel' },
  { id: 'mountain', native: '⛰️', keywords: ['nature'], category: 'travel' },
  { id: 'volcano', native: '🌋', keywords: ['nature', 'disaster'], category: 'travel' },
  { id: 'mount_fuji', native: '🗻', keywords: ['mountain', 'japan'], category: 'travel' },
  { id: 'camping', native: '🏕️', keywords: ['outdoor', 'tent'], category: 'travel' },
  { id: 'beach_umbrella', native: '🏖️', keywords: ['vacation', 'summer'], category: 'travel' },
  { id: 'desert', native: '🏜️', keywords: ['nature', 'hot'], category: 'travel' },
  { id: 'desert_island', native: '🏝️', keywords: ['vacation', 'tropical'], category: 'travel' },
  { id: 'national_park', native: '🏞️', keywords: ['nature', 'park'], category: 'travel' },
  { id: 'stadium', native: '🏟️', keywords: ['sports', 'venue'], category: 'travel' },
  { id: 'classical_building', native: '🏛️', keywords: ['building', 'history'], category: 'travel' },
  { id: 'building_construction', native: '🏗️', keywords: ['work', 'construction'], category: 'travel' },
  { id: 'bricks', native: '🧱', keywords: ['construction', 'wall'], category: 'travel' },
  { id: 'rock', native: '🪨', keywords: ['stone', 'nature'], category: 'travel' },
  { id: 'wood', native: '🪵', keywords: ['nature', 'construction'], category: 'travel' },
  { id: 'hut', native: '🛖', keywords: ['house', 'home'], category: 'travel' },
  { id: 'houses', native: '🏘️', keywords: ['building', 'homes'], category: 'travel' },
  { id: 'derelict_house', native: '🏚️', keywords: ['building', 'abandoned'], category: 'travel' },
  { id: 'house', native: '🏠', keywords: ['building', 'home'], category: 'travel' },
  { id: 'house_with_garden', native: '🏡', keywords: ['building', 'home'], category: 'travel' },
  { id: 'office', native: '🏢', keywords: ['building', 'work'], category: 'travel' },
  { id: 'post_office', native: '🏣', keywords: ['building'], category: 'travel' },
  { id: 'european_post_office', native: '🏤', keywords: ['building'], category: 'travel' },
  { id: 'hospital', native: '🏥', keywords: ['building', 'health'], category: 'travel' },
  { id: 'bank', native: '🏦', keywords: ['building', 'money'], category: 'travel' },
  { id: 'hotel', native: '🏨', keywords: ['building', 'travel'], category: 'travel' },
  { id: 'love_hotel', native: '🏩', keywords: ['building'], category: 'travel' },
  { id: 'convenience_store', native: '🏪', keywords: ['building', 'shop'], category: 'travel' },
  { id: 'school', native: '🏫', keywords: ['building', 'education'], category: 'travel' },
  { id: 'department_store', native: '🏬', keywords: ['building', 'shopping'], category: 'travel' },
  { id: 'factory', native: '🏭', keywords: ['building', 'work'], category: 'travel' },
  { id: 'japanese_castle', native: '🏯', keywords: ['building'], category: 'travel' },
  { id: 'european_castle', native: '🏰', keywords: ['building'], category: 'travel' },
  { id: 'wedding', native: '💒', keywords: ['building', 'love', 'celebration'], category: 'travel' },
  { id: 'tokyo_tower', native: '🗼', keywords: ['landmark', 'japan'], category: 'travel' },
  { id: 'statue_of_liberty', native: '🗽', keywords: ['landmark', 'usa'], category: 'travel' },
  { id: 'church', native: '⛪', keywords: ['building', 'religion'], category: 'travel' },
  { id: 'mosque', native: '🕌', keywords: ['building', 'religion'], category: 'travel' },
  { id: 'hindu_temple', native: '🛕', keywords: ['building', 'religion'], category: 'travel' },
  { id: 'synagogue', native: '🕍', keywords: ['building', 'religion'], category: 'travel' },
  { id: 'shinto_shrine', native: '⛩️', keywords: ['building', 'religion', 'japan'], category: 'travel' },
  { id: 'kaaba', native: '🕋', keywords: ['building', 'religion'], category: 'travel' },
  { id: 'fountain', native: '⛲', keywords: ['water', 'park'], category: 'travel' },
  { id: 'tent', native: '⛺', keywords: ['camping', 'outdoor'], category: 'travel' },
  { id: 'foggy', native: '🌁', keywords: ['weather'], category: 'travel' },
  { id: 'night_with_stars', native: '🌃', keywords: ['city', 'night'], category: 'travel' },
  { id: 'city_sunrise', native: '🌇', keywords: ['city', 'sunrise'], category: 'travel' },
  { id: 'city_sunset', native: '🌆', keywords: ['city', 'sunset'], category: 'travel' },
  { id: 'cityscape', native: '🏙️', keywords: ['city', 'buildings'], category: 'travel' },
  { id: 'bridge_at_night', native: '🌉', keywords: ['city', 'night'], category: 'travel' },
  { id: 'hotsprings', native: '♨️', keywords: ['bath', 'hot spring'], category: 'travel' },
  { id: 'carousel_horse', native: '🎠', keywords: ['amusement', 'park'], category: 'travel' },
  { id: 'ferris_wheel', native: '🎡', keywords: ['amusement', 'park'], category: 'travel' },
  { id: 'roller_coaster', native: '🎢', keywords: ['amusement', 'park'], category: 'travel' },
  { id: 'barber', native: '💈', keywords: ['shop', 'haircut'], category: 'travel' },
  { id: 'circus_tent', native: '🎪', keywords: ['entertainment'], category: 'travel' },
  { id: 'steam_locomotive', native: '🚂', keywords: ['transport', 'train'], category: 'travel' },
  { id: 'railway_car', native: '🚃', keywords: ['transport', 'train'], category: 'travel' },
  { id: 'bullettrain_side', native: '🚄', keywords: ['transport', 'train', 'fast'], category: 'travel' },
  { id: 'bullettrain_front', native: '🚅', keywords: ['transport', 'train', 'fast'], category: 'travel' },
  { id: 'train2', native: '🚆', keywords: ['transport'], category: 'travel' },
  { id: 'metro', native: '🚇', keywords: ['transport', 'subway'], category: 'travel' },
  { id: 'light_rail', native: '🚈', keywords: ['transport', 'tram'], category: 'travel' },
  { id: 'station', native: '🚉', keywords: ['transport', 'train'], category: 'travel' },
  { id: 'tram', native: '🚊', keywords: ['transport'], category: 'travel' },
  { id: 'monorail', native: '🚝', keywords: ['transport'], category: 'travel' },
  { id: 'mountain_railway', native: '🚞', keywords: ['transport'], category: 'travel' },
  { id: 'train', native: '🚋', keywords: ['transport', 'tram'], category: 'travel' },
  { id: 'bus', native: '🚌', keywords: ['transport'], category: 'travel' },
  { id: 'oncoming_bus', native: '🚍', keywords: ['transport'], category: 'travel' },
  { id: 'trolleybus', native: '🚎', keywords: ['transport'], category: 'travel' },
  { id: 'minibus', native: '🚐', keywords: ['transport'], category: 'travel' },
  { id: 'ambulance', native: '🚑', keywords: ['vehicle', 'emergency'], category: 'travel' },
  { id: 'fire_engine', native: '🚒', keywords: ['vehicle', 'emergency'], category: 'travel' },
  { id: 'police_car', native: '🚓', keywords: ['vehicle', 'emergency'], category: 'travel' },
  { id: 'oncoming_police_car', native: '🚔', keywords: ['vehicle', 'emergency'], category: 'travel' },
  { id: 'taxi', native: '🚕', keywords: ['vehicle', 'transport'], category: 'travel' },
  { id: 'oncoming_taxi', native: '🚖', keywords: ['vehicle', 'transport'], category: 'travel' },
  { id: 'car', native: '🚗', keywords: ['vehicle', 'transport'], category: 'travel' },
  { id: 'oncoming_automobile', native: '🚘', keywords: ['vehicle', 'transport'], category: 'travel' },
  { id: 'blue_car', native: '🚙', keywords: ['vehicle', 'suv'], category: 'travel' },
  { id: 'pickup_truck', native: '🛻', keywords: ['vehicle', 'truck'], category: 'travel' },
  { id: 'truck', native: '🚚', keywords: ['vehicle', 'delivery'], category: 'travel' },
  { id: 'articulated_lorry', native: '🚛', keywords: ['vehicle', 'truck'], category: 'travel' },
  { id: 'tractor', native: '🚜', keywords: ['vehicle', 'farm'], category: 'travel' },
  { id: 'racing_car', native: '🏎️', keywords: ['vehicle', 'fast'], category: 'travel' },
  { id: 'motorcycle', native: '🏍️', keywords: ['vehicle', 'bike'], category: 'travel' },
  { id: 'motor_scooter', native: '🛵', keywords: ['vehicle'], category: 'travel' },
  { id: 'manual_wheelchair', native: '🦽', keywords: ['accessibility'], category: 'travel' },
  { id: 'motorized_wheelchair', native: '🦼', keywords: ['accessibility'], category: 'travel' },
  { id: 'auto_rickshaw', native: '🛺', keywords: ['vehicle', 'transport'], category: 'travel' },
  { id: 'bike', native: '🚲', keywords: ['vehicle', 'transport', 'sport'], category: 'travel' },
  { id: 'kick_scooter', native: '🛴', keywords: ['vehicle'], category: 'travel' },
  { id: 'skateboard', native: '🛹', keywords: ['vehicle', 'sport'], category: 'travel' },
  { id: 'roller_skate', native: '🛼', keywords: ['vehicle', 'sport'], category: 'travel' },
  { id: 'busstop', native: '🚏', keywords: ['transport'], category: 'travel' },
  { id: 'motorway', native: '🛣️', keywords: ['road', 'highway'], category: 'travel' },
  { id: 'railway_track', native: '🛤️', keywords: ['train'], category: 'travel' },
  { id: 'oil_drum', native: '🛢️', keywords: ['oil', 'barrel'], category: 'travel' },
  { id: 'fuelpump', native: '⛽', keywords: ['gas', 'station'], category: 'travel' },
  { id: 'rotating_light', native: '🚨', keywords: ['emergency', 'police'], category: 'travel' },
  { id: 'traffic_light', native: '🚥', keywords: ['transport', 'signal'], category: 'travel' },
  { id: 'vertical_traffic_light', native: '🚦', keywords: ['transport', 'signal'], category: 'travel' },
  { id: 'stop_sign', native: '🛑', keywords: ['sign', 'stop'], category: 'travel' },
  { id: 'construction', native: '🚧', keywords: ['work', 'warning'], category: 'travel' },
  { id: 'anchor', native: '⚓', keywords: ['ship', 'sea'], category: 'travel' },
  { id: 'boat', native: '⛵', keywords: ['ship', 'sea', 'vacation'], category: 'travel' },
  { id: 'canoe', native: '🛶', keywords: ['boat', 'sea'], category: 'travel' },
  { id: 'speedboat', native: '🚤', keywords: ['ship', 'sea'], category: 'travel' },
  { id: 'passenger_ship', native: '🛳️', keywords: ['ship', 'cruise'], category: 'travel' },
  { id: 'ferry', native: '⛴️', keywords: ['ship', 'boat'], category: 'travel' },
  { id: 'motor_boat', native: '🛥️', keywords: ['ship'], category: 'travel' },
  { id: 'ship', native: '🚢', keywords: ['transport', 'sea'], category: 'travel' },
  { id: 'airplane', native: '✈️', keywords: ['transport', 'flight', 'vacation'], category: 'travel' },
  { id: 'small_airplane', native: '🛩️', keywords: ['transport', 'flight'], category: 'travel' },
  { id: 'flight_departure', native: '🛫', keywords: ['airplane', 'airport'], category: 'travel' },
  { id: 'flight_arrival', native: '🛬', keywords: ['airplane', 'airport'], category: 'travel' },
  { id: 'parachute', native: '🪂', keywords: ['fly', 'sport'], category: 'travel' },
  { id: 'seat', native: '💺', keywords: ['chair', 'airplane'], category: 'travel' },
  { id: 'helicopter', native: '🚁', keywords: ['transport', 'flight'], category: 'travel' },
  { id: 'suspension_railway', native: '🚟', keywords: ['transport'], category: 'travel' },
  { id: 'mountain_cableway', native: '🚠', keywords: ['transport'], category: 'travel' },
  { id: 'aerial_tramway', native: '🚡', keywords: ['transport'], category: 'travel' },
  { id: 'artificial_satellite', native: '🛰️', keywords: ['space', 'nasa'], category: 'travel' },
  { id: 'rocket', native: '🚀', keywords: ['space', 'nasa', 'launch'], category: 'travel' },
  { id: 'flying_saucer', native: '🛸', keywords: ['ufo', 'alien'], category: 'travel' },
  { id: 'bellhop_bell', native: '🛎️', keywords: ['hotel', 'service'], category: 'travel' },
  { id: 'luggage', native: '🧳', keywords: ['travel', 'packing'], category: 'travel' },
  { id: 'hourglass', native: '⌛', keywords: ['time', 'waiting'], category: 'travel' },
  { id: 'hourglass_flowing_sand', native: '⏳', keywords: ['time', 'waiting'], category: 'travel' },
  { id: 'watch', native: '⌚', keywords: ['time', 'accessory'], category: 'travel' },
  { id: 'alarm_clock', native: '⏰', keywords: ['time', 'morning'], category: 'travel' },
  { id: 'stopwatch', native: '⏱️', keywords: ['time', 'sport'], category: 'travel' },
  { id: 'timer_clock', native: '⏲️', keywords: ['time', 'cooking'], category: 'travel' },
  { id: 'mantelpiece_clock', native: '🕰️', keywords: ['time'], category: 'travel' },
  { id: 'clock12', native: '🕛', keywords: ['time', 'noon'], category: 'travel' },
  { id: 'clock1230', native: '🕧', keywords: ['time'], category: 'travel' },
  { id: 'clock1', native: '🕐', keywords: ['time'], category: 'travel' },
  { id: 'clock130', native: '🕜', keywords: ['time'], category: 'travel' },
  { id: 'clock2', native: '🕑', keywords: ['time'], category: 'travel' },
  { id: 'clock230', native: '🕝', keywords: ['time'], category: 'travel' },
  { id: 'clock3', native: '🕒', keywords: ['time'], category: 'travel' },
  { id: 'clock330', native: '🕞', keywords: ['time'], category: 'travel' },
  { id: 'clock4', native: '🕓', keywords: ['time'], category: 'travel' },
  { id: 'clock430', native: '🕟', keywords: ['time'], category: 'travel' },
  { id: 'clock5', native: '🕔', keywords: ['time'], category: 'travel' },
  { id: 'clock530', native: '🕠', keywords: ['time'], category: 'travel' },
  { id: 'clock6', native: '🕕', keywords: ['time'], category: 'travel' },
  { id: 'clock630', native: '🕡', keywords: ['time'], category: 'travel' },
  { id: 'clock7', native: '🕖', keywords: ['time'], category: 'travel' },
  { id: 'clock730', native: '🕢', keywords: ['time'], category: 'travel' },
  { id: 'clock8', native: '🕗', keywords: ['time'], category: 'travel' },
  { id: 'clock830', native: '🕣', keywords: ['time'], category: 'travel' },
  { id: 'clock9', native: '🕘', keywords: ['time'], category: 'travel' },
  { id: 'clock930', native: '🕤', keywords: ['time'], category: 'travel' },
  { id: 'clock10', native: '🕙', keywords: ['time'], category: 'travel' },
  { id: 'clock1030', native: '🕥', keywords: ['time'], category: 'travel' },
  { id: 'clock11', native: '🕚', keywords: ['time'], category: 'travel' },
  { id: 'clock1130', native: '🕦', keywords: ['time'], category: 'travel' },
  { id: 'new_moon', native: '🌑', keywords: ['space', 'night'], category: 'travel' },
  { id: 'waxing_crescent_moon', native: '🌒', keywords: ['space', 'night'], category: 'travel' },
  { id: 'first_quarter_moon', native: '🌓', keywords: ['space', 'night'], category: 'travel' },
  { id: 'moon', native: '🌔', keywords: ['space', 'night'], category: 'travel' },
  { id: 'full_moon', native: '🌕', keywords: ['space', 'night'], category: 'travel' },
  { id: 'waning_gibbous_moon', native: '🌖', keywords: ['space', 'night'], category: 'travel' },
  { id: 'last_quarter_moon', native: '🌗', keywords: ['space', 'night'], category: 'travel' },
  { id: 'waning_crescent_moon', native: '🌘', keywords: ['space', 'night'], category: 'travel' },
  { id: 'crescent_moon', native: '🌙', keywords: ['space', 'night'], category: 'travel' },
  { id: 'new_moon_with_face', native: '🌚', keywords: ['space', 'night'], category: 'travel' },
  { id: 'first_quarter_moon_with_face', native: '🌛', keywords: ['space', 'night'], category: 'travel' },
  { id: 'last_quarter_moon_with_face', native: '🌜', keywords: ['space', 'night'], category: 'travel' },
  { id: 'thermometer', native: '🌡️', keywords: ['weather', 'hot', 'cold'], category: 'travel' },
  { id: 'sunny', native: '☀️', keywords: ['weather', 'sun', 'summer'], category: 'travel' },
  { id: 'full_moon_with_face', native: '🌝', keywords: ['space', 'night'], category: 'travel' },
  { id: 'sun_with_face', native: '🌞', keywords: ['weather', 'summer'], category: 'travel' },
  { id: 'ringed_planet', native: '🪐', keywords: ['space', 'saturn'], category: 'travel' },
  { id: 'star', native: '⭐', keywords: ['space', 'night'], category: 'travel' },
  { id: 'star2', native: '🌟', keywords: ['space', 'night', 'glow'], category: 'travel' },
  { id: 'stars', native: '🌠', keywords: ['space', 'night', 'shooting'], category: 'travel' },
  { id: 'milky_way', native: '🌌', keywords: ['space', 'night'], category: 'travel' },
  { id: 'cloud', native: '☁️', keywords: ['weather'], category: 'travel' },
  { id: 'partly_sunny', native: '⛅', keywords: ['weather', 'cloudy'], category: 'travel' },
  { id: 'cloud_with_lightning_and_rain', native: '⛈️', keywords: ['weather', 'storm'], category: 'travel' },
  { id: 'sun_behind_small_cloud', native: '🌤️', keywords: ['weather'], category: 'travel' },
  { id: 'sun_behind_large_cloud', native: '🌥️', keywords: ['weather'], category: 'travel' },
  { id: 'sun_behind_rain_cloud', native: '🌦️', keywords: ['weather'], category: 'travel' },
  { id: 'cloud_with_rain', native: '🌧️', keywords: ['weather'], category: 'travel' },
  { id: 'cloud_with_snow', native: '🌨️', keywords: ['weather', 'winter'], category: 'travel' },
  { id: 'cloud_with_lightning', native: '🌩️', keywords: ['weather', 'storm'], category: 'travel' },
  { id: 'tornado', native: '🌪️', keywords: ['weather', 'disaster'], category: 'travel' },
  { id: 'fog', native: '🌫️', keywords: ['weather'], category: 'travel' },
  { id: 'wind_face', native: '🌬️', keywords: ['weather', 'air'], category: 'travel' },
  { id: 'cyclone', native: '🌀', keywords: ['weather', 'disaster'], category: 'travel' },
  { id: 'rainbow', native: '🌈', keywords: ['weather', 'nature'], category: 'travel' },
  { id: 'closed_umbrella', native: '🌂', keywords: ['weather', 'rain'], category: 'travel' },
  { id: 'open_umbrella', native: '☂️', keywords: ['weather', 'rain'], category: 'travel' },
  { id: 'umbrella', native: '☔', keywords: ['weather', 'rain'], category: 'travel' },
  { id: 'parasol_on_ground', native: '⛱️', keywords: ['beach', 'summer'], category: 'travel' },
  { id: 'zap', native: '⚡', keywords: ['weather', 'electric', 'fast'], category: 'travel' },
  { id: 'snowflake', native: '❄️', keywords: ['weather', 'winter', 'cold'], category: 'travel' },
  { id: 'snowman_with_snow', native: '☃️', keywords: ['weather', 'winter', 'christmas'], category: 'travel' },
  { id: 'snowman', native: '⛄', keywords: ['weather', 'winter'], category: 'travel' },
  { id: 'comet', native: '☄️', keywords: ['space'], category: 'travel' },
  { id: 'fire', native: '🔥', keywords: ['hot', 'burn'], category: 'travel' },
  { id: 'droplet', native: '💧', keywords: ['water', 'rain'], category: 'travel' },
  { id: 'ocean', native: '🌊', keywords: ['sea', 'water', 'wave'], category: 'travel' },
];

export function EmojiPickerComponent({ onSelectEmoji, onClose, position }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleEmojiSelect = useCallback((emojiId: string) => {
    onSelectEmoji(emojiId);
    onClose();
  }, [onSelectEmoji, onClose]);

  // Filtrar emojis pela busca e categoria
  const filteredEmojis = COMMON_EMOJIS.filter((emoji) => {
    const matchesSearch = searchTerm === '' || 
      emoji.id?.includes(searchTerm.toLowerCase()) ||
      emoji.keywords?.some((k) => k.includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || emoji.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      ref={pickerRef}
      className="emoji-picker-popup"
      style={{
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400),
        zIndex: 10000,
      }}
    >
      <div className="emoji-picker-container">
        {/* Search */}
        <div className="emoji-search">
          <input
            type="text"
            placeholder="Buscar emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Categories */}
        <div className="emoji-categories">
          <button
            className={`emoji-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
            title="Todos"
          >
            📋
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'smileys' ? 'active' : ''}`}
            onClick={() => setActiveCategory('smileys')}
            title="Smileys"
          >
            😀
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'people' ? 'active' : ''}`}
            onClick={() => setActiveCategory('people')}
            title="Pessoas"
          >
            👋
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'animals' ? 'active' : ''}`}
            onClick={() => setActiveCategory('animals')}
            title="Animais"
          >
            🐱
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'food' ? 'active' : ''}`}
            onClick={() => setActiveCategory('food')}
            title="Comida"
          >
            🍕
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveCategory('activities')}
            title="Atividades"
          >
            ⚽
          </button>
          <button
            className={`emoji-category-btn ${activeCategory === 'travel' ? 'active' : ''}`}
            onClick={() => setActiveCategory('travel')}
            title="Viagem"
          >
            🚗
          </button>
        </div>

        {/* Emoji Grid */}
        <div className="emoji-grid">
          {filteredEmojis.map((emoji: EmojiData) => (
            <button
              key={`${activeCategory}-${emoji.id}`}
              className="emoji-btn"
              onClick={() => handleEmojiSelect(emoji.id)}
              title={emoji.id}
            >
              {emoji.native}
            </button>
          ))}
        </div>

        {filteredEmojis.length === 0 && (
          <div className="emoji-no-results">
            Nenhum emoji encontrado
          </div>
        )}
      </div>
    </div>
  );
}
