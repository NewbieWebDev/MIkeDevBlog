import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import {
  PencilIcon,
  EyeIcon,
  CloudDownloadIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import * as MDComponents from "./MDComponents";

const tabs = [
  {
    text: "Write",
    icon: PencilIcon,
  },
  {
    text: "Preview",
    icon: EyeIcon,
  },
];

const Editor = ({
  initialData = null,
  showDeleteButton = false,
  showPublishButton = false,
  disabled = false,
  debounceDelay = 500,
  onChange = () => null,
  onPublish = () => null,
  onDelete = () => null,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [activeTab, setActiveTab] = useState(0);

  const [debouncedTitle] = useDebounce(title, debounceDelay);
  const [debouncedContent] = useDebounce(content, debounceDelay);

  const initialRendering = useRef(true);

  useEffect(() => {
    if (initialRendering.current) {
      initialRendering.current = false;
      return;
    }
    onChange(debouncedTitle, debouncedContent);
  }, [debouncedTitle, debouncedContent]);

  console.log(title);
  return (
    <div className="w-full max-w-screen-lg mx-auto">
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={150}
        placeholder="Title...."
        disabled={disabled}
        className="w-full text-3xl font-bold leading-snug bg-transparent outline-none appearance-none resize-none disabled:cursor-not-allowed "
      />
      <div className="mt-6 flex justify-center sm:justify-between items-center px-4 py-2 space-x-6 rounded bg-gray-100 border border-gray-300 text-gray-700 sticky top-0 ">
        <div className="flex items-center space-x-4">
          {tabs.map(({ text, icon: Icon }, i) => (
            <button
              key={text}
              onClick={() => setActiveTab(i)}
              disabled={disabled}
              className={`flex items-center space-x-1 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors${
                activeTab === i
                  ? "text-blue-600 cursor-default select-none disabled:hover:text-blue-600"
                  : "hover:text-blue-600 disabled:hover:text-current "
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              <span className="hidden sm:inline-block">{text}</span>
            </button>
          ))}
        </div>
        {/** Publish & delete actions */}
        <div className="flex items-center space-x-4">
          {showPublishButton ? (
            <button
              onClick={() => onPublish(title, content)}
              disabled={disabled}
              className="flex items-center space-x-1 transition-colors rounded-md focus:outline-none hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current"
            >
              <CloudDownloadIcon className="w-6 h-6 flex-shrink-0" />
              <span className="hidden sm:inline-block">Publish</span>
            </button>
          ) : null}
          {showDeleteButton ? (
            <button
              onClick={onDelete}
              disabled={disabled}
              className="flex items-center space-x-1 transition-colors rounded-md focus:outline-none hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-current"
            >
              <TrashIcon className="w-6 h-6 flex-shrink-0" />
              <span className="hidden sm:inline-block">Publish</span>
            </button>
          ) : null}
        </div>
      </div>
      {/** Post Content */}
      <div className="px-4 py-12">
        {activeTab === 0 ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            disabled={disabled}
            className="w-full min-h-screen resize-none bg-transparent focus:outline-none text-xl leading-snug disabled:cursor-not-allowed"
          />
        ) : (
          <article className="min-h-screen prose sm:prose-lg lg:prose-xl max-w-none">
            {content ? (
              <ReactMarkdown children={content} components={MDComponents} />
            ) : (
              <p>Nothing to preview yet....</p>
            )}
          </article>
        )}
      </div>
    </div>
  );
};

export default Editor;
