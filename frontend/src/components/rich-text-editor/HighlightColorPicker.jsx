import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Highlighter } from "lucide-react";
import { Button } from "../ui/button";

const PREDEFINED_COLORS = [
  "#fff475",
  "#ffd6a5",
  "#fdffb6",
  "#caff70",
  "#b9fbc0",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
  "#ffadad",
  "#ffd6e0",
  "#e2f0cb",
  "#cddafd",
];

export default function HighlightColorPicker({ editor }) {
  const [customColor, setCustomColor] = useState("#fff475");

  const setHighlight = (color) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Use a span, NOT a Button, to avoid nested buttons */}
        <span
          className="inline-flex items-center justify-center rounded-md h-8 w-8 cursor-pointer hover:bg-gray-100"
          tabIndex={0}
          role="button"
          aria-label="Highlight color picker"
        >
          <Highlighter className="h-4 w-4" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mb-2 font-medium">Highlight Color</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {PREDEFINED_COLORS.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => setHighlight(color)}
              aria-label={`Select ${color} as highlight color`}
              type="button"
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-8 h-8 p-0 border-0 cursor-pointer"
            aria-label="Custom color picker"
          />
          <Button
            size="sm"
            onClick={() => setHighlight(customColor)}
            type="button"
          >
            Custom Color
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          type="button"
        >
          Remove Highlight
        </Button>
      </PopoverContent>
    </Popover>
  );
}
