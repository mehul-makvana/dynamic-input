import React, { useState, useRef, useEffect } from "react";

interface DynamicInputProps {
  tags: string[];
}

const DynamicInput: React.FC<DynamicInputProps> = ({ tags }) => {
  const [inputValue, setInputValue] = useState("");
  const [inputContent, setInputContent] = useState<
    (string | { tag: string })[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const stringInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleTagClick = (tag: string) => {
    const cursorPosition =
      inputRef.current?.selectionStart ?? inputValue.length;

    const beforeCursor = inputValue.slice(0, cursorPosition);
    const afterCursor = inputValue.slice(cursorPosition);

    const newContent = [
      ...inputContent,
      beforeCursor,
      { tag },
      afterCursor,
    ].filter(Boolean);

    setInputContent(newContent);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const cursorPosition = inputRef.current?.selectionStart ?? 0;

    if (
      e.key === "Backspace" &&
      cursorPosition === 0 &&
      inputContent.length > 0
    ) {
      e.preventDefault();

      const lastItemIndex = inputContent.length - 1;

      if (typeof inputContent[lastItemIndex] === "string") {
        const ref = stringInputRefs.current[lastItemIndex];
        if (ref) {
          ref.focus();
        }
        return;
      }

      const newContent = [...inputContent];
      newContent.pop();
      setInputContent(newContent);
    }
  };

  const handleStringChange = (index: number, newValue: string) => {
    if (newValue === "") {
      inputRef.current?.focus();
      const newContent = [...inputContent];
      newContent.splice(index, 1);
      setInputContent(newContent);
      return;
    }
    const newContent = inputContent.map((item, i) =>
      i === index ? newValue : item
    );
    setInputContent(newContent);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      handleBackspace(e);
    }
  };

  const handleTagRemove = (index: number) => {
    const newContent = inputContent.filter((_, i) => i !== index);
    setInputContent(newContent);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex space-x-2 mb-4">
        {tags.map((tag) => (
          <button
            key={tag}
            className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors duration-300 ease-in-out"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="relative border border-gray-300 rounded p-2">
        <div className="flex flex-wrap gap-2 items-center">
          {inputContent.map((item, index) => {
            if (typeof item === "string") {
              return (
                <input
                  key={index}
                  ref={(el) => (stringInputRefs.current[index] = el)}
                  type="text"
                  value={item}
                  className="rounded px-2 py-1 border border-transparent focus:border-none transition-all duration-300"
                  onChange={(e) => handleStringChange(index, e.target.value)}
                  style={{
                    width: item.length + "ch",
                  }}
                />
              );
            } else {
              return (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center space-x-2 gap-2"
                >
                  {item.tag}
                  <button
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    onClick={() => handleTagRemove(index)}
                  >
                    &times;
                  </button>
                </span>
              );
            }
          })}
          <input
            ref={inputRef}
            type="text"
            className="flex-grow outline-none px-2 py-1 text-gray-800"
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
            onKeyDown={handleInputKeyDown}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicInput;
