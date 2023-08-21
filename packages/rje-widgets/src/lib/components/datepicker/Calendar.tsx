import { Button } from '../button/Button';
import { createCalendar, getWeeksInMonth } from '@internationalized/date';
import { useCalendar, useCalendarCell, useCalendarGrid } from 'react-aria';
import { useCalendarState } from 'react-stately';
import { useLocale } from 'react-aria';
import { useRef } from 'react';
import classNames from 'classnames';

export function Calendar(props) {
    let { locale } = useLocale();
    let state = useCalendarState({
        ...props,
        locale,
        createCalendar
    });

    let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);

    return (
        <div className="rje-calendar" {...calendarProps}>
            <div className="rje-calendar__header">
                <Button variant="text" icon="chevron_left" {...prevButtonProps} />
                <h1>{title}</h1>
                <Button variant="text" icon="chevron_right" {...nextButtonProps} />
            </div>
            <CalendarGrid state={state} />
        </div>
    );
}

function CalendarGrid({ state, ...props }) {
    let { locale } = useLocale();
    let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

    return (
        <table {...gridProps}>
            <thead {...headerProps}>
                <tr>
                    {weekDays.map((day, index) => (
                        <th key={index}>{day}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
                    <tr key={weekIndex}>
                        {state
                            .getDatesInWeek(weekIndex)
                            .map((date, i) =>
                                date ? <CalendarCell key={i} state={state} date={date} /> : <td key={i} />
                            )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function CalendarCell({ state, date }) {
    let ref = useRef(null);
    let { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, isUnavailable, formattedDate } =
        useCalendarCell({ date }, state, ref);

    return (
        <td {...cellProps}>
            <div
                className={classNames('rje-calendar__cell', {
                    'rje-calendar__cell--selected': isSelected,
                    'rje-calendar__cell--disabled': isDisabled,
                    'rje-calendar__cell--unavailable': isUnavailable
                })}
                {...buttonProps}
                ref={ref}
                hidden={isOutsideVisibleRange}
            >
                {formattedDate}
            </div>
        </td>
    );
}
