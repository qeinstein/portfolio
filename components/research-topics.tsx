import { useRef, useState } from "react";
import { academicProfile } from "@/lib/academic-profile";

export function ResearchTopics() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const topics = academicProfile.research;
  return <div className="research-topics">
    <div className="research-pills" role="tablist" aria-label="Research areas">
      {topics.map((topic, index) => <button
        key={topic.id} ref={element => { tabs.current[index] = element; }}
        type="button" role="tab" id={`topic-${topic.id}`} aria-controls={`panel-${topic.id}`}
        aria-selected={active === index} tabIndex={active === index ? 0 : -1}
        onPointerEnter={event => { if (event.pointerType === "mouse") setActive(index); }}
        onFocus={() => setActive(index)} onClick={() => setActive(index)}
        onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % topics.length;
          else if (event.key === "ArrowLeft") next = (index + topics.length - 1) % topics.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = topics.length - 1;
          else return;
          event.preventDefault(); tabs.current[next]?.focus();
        }}>
        <span className="topic-symbol" aria-hidden="true">{["◌", "⌁", "⋮"][index]}</span>{topic.title}
      </button>)}
    </div>
    <div className="research-panels">
      {topics.map((topic, index) => <div key={topic.id} role="tabpanel" id={`panel-${topic.id}`}
        aria-labelledby={`topic-${topic.id}`} hidden={active !== index} tabIndex={0}>
        <p>{topic.description}</p>
      </div>)}
    </div>
  </div>;
}
