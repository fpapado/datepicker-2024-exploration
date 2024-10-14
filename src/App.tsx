import { Temporal } from "@js-temporal/polyfill";

import {
  HTMLAttributes,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

import { Component as ChevronLeft } from "./assets/chevron-left.svg?svgUse";
import { Component as ChevronRight } from "./assets/chevron-right.svg?svgUse";
import { Component as CalendarIcon } from "./assets/calendar.svg?svgUse";

function Datepicker({
  onConfirmSelectedDate,
  ...rest
}: {
  onConfirmSelectedDate: (date: Temporal.PlainDate) => void;
} & HTMLAttributes<HTMLDivElement>) {
  const idPrefix = useId();
  const monthInputId = idPrefix + "-month";
  const yearInputId = idPrefix + "-year";

  const locale = "en";
  const calendar = "gregory";
  const today = useMemo(() => Temporal.Now.plainDate(calendar), []);

  const [selectedDate, setSelectedDate] = useState(today);
  const [browsingDate, setBrowsingDate] = useState(selectedDate);

  const browsingYear = browsingDate.year;

  const possibleYears = useMemo(
    () =>
      Array.from(
        new Array(120).keys(),
        (i) => new Temporal.PlainYearMonth(today.year - i, 1, calendar)
      ),
    [today.year]
  );

  const allMonths = useMemo(
    () =>
      Array.from(
        new Array(today.monthsInYear).keys(),
        (i) =>
          new Temporal.PlainYearMonth(
            browsingYear,
            // months are 1-indexed in Temporal
            i + 1,
            calendar
          )
      ),
    [browsingYear, today.monthsInYear]
  );

  const browsingMonth = browsingDate.month;

  const browsingDays = Array.from(
    new Array(browsingDate.daysInMonth).keys(),
    (i) =>
      new Temporal.PlainDate(
        browsingYear,
        browsingMonth,
        // days are 1-indexed in Temporal
        i + 1,
        calendar
      )
  );

  return (
    <div {...rest} className="datepicker">
      <header>
        <div className="month-year">
          <div>
            <label className="visually-hidden" htmlFor={monthInputId}>
              Month
            </label>
            <select
              id={monthInputId}
              value={browsingMonth}
              onChange={(ev) => {
                setBrowsingDate(
                  browsingDate.with({
                    month: parseInt(ev.currentTarget.value),
                  })
                );
              }}
            >
              {/* TODO: Localise */}
              {allMonths.map((m) => (
                <option key={m.month} value={m.month}>
                  {m.toLocaleString(locale, { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="visually-hidden" htmlFor={yearInputId}>
              Year
            </label>
            <select
              id={yearInputId}
              value={browsingYear}
              onChange={(ev) => {
                setBrowsingDate(
                  browsingDate.with({
                    year: parseInt(ev.currentTarget.value),
                  })
                );
              }}
            >
              {possibleYears.map((m) => (
                <option key={m.year} value={m.year}>
                  {m.year}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setBrowsingDate(today);
            }}
          >
            Today
          </button>
        </div>
        <div className="month-buttons">
          <button
            aria-label="Previous month"
            type="button"
            onClick={() => {
              setBrowsingDate(browsingDate.subtract({ months: 1 }));
            }}
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Next month"
            type="button"
            onClick={() => {
              setBrowsingDate(browsingDate.add({ months: 1 }));
            }}
          >
            <ChevronRight />
          </button>
        </div>
      </header>
      <div className="days-grid">
        {browsingDays.map((d) => (
          <button
            type="button"
            className="browsing-day"
            aria-current={today.equals(d) ? "date" : undefined}
            aria-pressed={selectedDate.equals(d)}
            key={d.day}
            onClick={() => {
              setSelectedDate(d);
            }}
          >
            {d.day}
          </button>
        ))}
      </div>
      <footer>
        <button
          type="button"
          onClick={() => {
            onConfirmSelectedDate(selectedDate);
          }}
        >
          Done
        </button>
      </footer>
    </div>
  );
}

function App() {
  const idPrefix = useId();
  const inputId = idPrefix + "input";
  const popoverId = idPrefix + "picker-popover";

  const [popoverState, setPopoverState] = useState<"open" | "closed">("closed");

  const popoverRef = useRef<HTMLDivElement | null>();

  const onPopoverRef = useCallback((el: HTMLDivElement | null) => {
    console.log(el);
    popoverRef.current = el;

    const onToggle = (ev: ToggleEvent) =>
      setPopoverState(ev.newState as "open" | "closed");

    el?.addEventListener(
      "toggle",
      // @ts-expect-error -- ts does not type the 'toggle' event as ToggleEvent yet
      onToggle
    );
  }, []);

  return (
    <form className="date-form">
      <label htmlFor={inputId}>Date</label>
      <div className="datetime-input-wrapper">
        <input id={inputId} type="text" placeholder="15.10.2024" />
        <button
          type="button"
          className="datepicker-opener"
          //@ts-expect-error not recognised
          popovertarget={popoverId}
          // NOTE: Arguably, we could elect to move the focus when opening the
          // popover, in which case we could skip [aria-expanded] and use
          // aria-haspopup="dialog" instead. However, we choose to let the user
          // navigate to the popover contents on their own. There are a few
          // possible designs here; we just picked this one for simplicity and
          // demonstration.
          aria-expanded={popoverState === "open"}
        >
          <CalendarIcon role="img" aria-label="Calendar" />
        </button>
      </div>
      <div
        className="datepicker-popover"
        id={popoverId}
        ref={onPopoverRef}
        // The datepicker with a popover is a non-modal dialog
        role="dialog"
        //@ts-expect-error -- react/jsx types do not know about popover yet...
        popover=""
      >
        <Datepicker
          onConfirmSelectedDate={(date) => {
            popoverRef.current?.hidePopover();
            // TODO: Separate the popover from the Datepicker itself
          }}
        />
      </div>
    </form>
  );
}

export default App;
