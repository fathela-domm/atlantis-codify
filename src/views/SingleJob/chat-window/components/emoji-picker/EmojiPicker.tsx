import React from 'react';
import EmojiConvertor from 'emoji-js';
import emojiData from './emojiData.json';


const emojiConvertor = new EmojiConvertor();
emojiConvertor.init_env();

interface EmojiPickerProps {
  onEmojiPicked: any;
  filter: any;
}

const EmojiPicker = ({ onEmojiPicked, filter }: EmojiPickerProps) => (
  <div className="sc-emoji-picker">
    {emojiData.map((category) => {
      const filteredEmojis = category.emojis.filter(({ name }) => name.includes(filter));
      return (
        <div className="sc-emoji-picker--category" key={category.name}>
          {
            filteredEmojis.length > 0 &&
            <div className="sc-emoji-picker--category-title">{category.name}</div>
          }
          {filteredEmojis.map(({ char, _name }: any) => {
            return (
              <span
                key={char}
                className="sc-emoji-picker--emoji"
                onClick={() => onEmojiPicked(char)}
              >
                {char}
              </span>
            );
          })}
        </div>
      );
    })}
  </div>
);

export default EmojiPicker;
