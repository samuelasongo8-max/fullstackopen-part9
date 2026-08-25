interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: 'background';
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: 'special';
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

type HeaderProps = {
  name: string;
};

type ContentProps = {
  parts: CoursePart[];
};

type TotalProps = {
  parts: CoursePart[];
};

type PartProps = {
  part: CoursePart;
};

const Header = ({ name }: HeaderProps) => {
  return <h1>{name}</h1>;
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          {part.description}
        </p>
      );
    case 'group':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          Project exercises: {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          {part.description}
          <br />
          Background material: {part.backgroundMaterial}
        </p>
      );
    case 'special':
      return (
        <p>
          {part.name} {part.exerciseCount}
          <br />
          {part.description}
          <br />
          Requirements: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

const Total = ({ parts }: TotalProps) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  const courseName = 'Half Stack application development';

  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial: 'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </div>
  );
};

export default App;
