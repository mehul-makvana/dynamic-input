import React, { useState, useRef } from "react";

interface Tag {
  id: number;
  label: string;
  type?: string;
}
const tagSuggestions: Tag[] = [
  { id: 1, label: "React" },
  { id: 2, label: "Next.js" },
  { id: 3, label: "Tailwind" },
  { id: 4, label: "JavaScript" },
  { id: 5, label: "CSS" },
];

const TagInput = () => {
  const [content, setContent] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCursorPosition = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const value = inputValue.trim();
      setContent([
        ...content,
        {
          id: content.length + 1,
          label: value,
          type: "text",
        },
      ]);
      setInputValue("");
    }

    if (e.key === "Backspace" && inputValue === "" && content.length > 0) {
      e.preventDefault();
      const newContent = [...content];
      newContent.pop();
      setContent(newContent);
      handleCursorPosition();
    }
  };

  const addTag = (tag: Tag) => {
    setContent([...content, tag]);
    handleCursorPosition();
  };

  const removeTag = (id: number) => {
    setContent(content.filter((item) => item.id !== id));
  };

  console.log("content=--=", content);

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative border border-black p-2 rounded-md w-full flex flex-wrap items-center space-x-1">
        {content.map((item, index) =>
          item?.type === "text" ? (
            <span key={`${item.label}-${index}`} className="mr-2">
              {item.label}
            </span>
          ) : (
            <span
              key={item.id}
              className="flex items-center bg-gray-300 text-black px-3 py-1 rounded-full mr-2"
            >
              {item.label}
              <button
                onClick={() => removeTag(item.id)}
                className="ml-1 bg-gray-700 text-white rounded-full px-2 py-1"
              >
                x
              </button>
            </span>
          )
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="focus:outline-none p-1 border-none flex-grow"
        />
      </div>
      <div className="flex space-x-2">
        {tagSuggestions.map((tag) => (
          <button
            key={tag.id}
            onClick={() => addTag(tag)}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
