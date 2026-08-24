import { type NewDiaryEntry, Weather, Visibility } from './types.ts';

const isString = (value: unknown): value is string => typeof value === 'string';

const isWeather = (value: unknown): value is NewDiaryEntry['weather'] =>
  isString(value) && Object.values(Weather).includes(value as NewDiaryEntry['weather']);

const isVisibility = (value: unknown): value is NewDiaryEntry['visibility'] =>
  isString(value) && Object.values(Visibility).includes(value as NewDiaryEntry['visibility']);

const isValidDate = (value: unknown): value is string =>
  isString(value) && !Number.isNaN(Date.parse(value));

export const parseNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (typeof object !== 'object' || object === null) {
    throw new Error('Diary entry must be an object');
  }

  const entry = object as Record<string, unknown>;

  if (!isString(entry.comment)) {
    throw new Error('Comment must be a string');
  }
  if (!isValidDate(entry.date)) {
    throw new Error('Date must be a valid date string');
  }
  if (!isWeather(entry.weather)) {
    throw new Error('Weather is invalid');
  }
  if (!isVisibility(entry.visibility)) {
    throw new Error('Visibility is invalid');
  }

  return {
    date: entry.date,
    weather: entry.weather,
    visibility: entry.visibility,
    comment: entry.comment,
  };
};