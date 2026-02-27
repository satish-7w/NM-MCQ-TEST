import { TestSet } from './types';

export const QUESTIONS: TestSet[] = [
  {
    id: 'MCQ1',
    title: 'Basics of Piping Design',
    questions: [
      {
        id: '1',
        text: 'What is the primary purpose of piping design?',
        options: [
          { id: 'A', text: 'Improve building aesthetics' },
          { id: 'B', text: 'Transport fluids safely and efficiently' },
          { id: 'C', text: 'Reduce equipment cost' },
          { id: 'D', text: 'Increase plant height' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '2',
        text: 'Which code is commonly used for process piping?',
        options: [
          { id: 'A', text: 'ASME B31.1' },
          { id: 'B', text: 'ASME B31.3' },
          { id: 'C', text: 'API 650' },
          { id: 'D', text: 'IS 456' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '3',
        text: 'What does NPS stand for?',
        options: [
          { id: 'A', text: 'Nominal Pipe Size' },
          { id: 'B', text: 'Net Pressure System' },
          { id: 'C', text: 'Normal Pipe Section' },
          { id: 'D', text: 'Nominal Pressure Size' }
        ],
        correctAnswer: 'A'
      },
      {
        id: '4',
        text: 'Which load is caused due to temperature variation?',
        options: [
          { id: 'A', text: 'Wind load' },
          { id: 'B', text: 'Dead load' },
          { id: 'C', text: 'Thermal load' },
          { id: 'D', text: 'Live load' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '5',
        text: 'What is the function of pipe supports?',
        options: [
          { id: 'A', text: 'Increase pressure' },
          { id: 'B', text: 'Reduce temperature' },
          { id: 'C', text: 'Carry pipe weight and control movement' },
          { id: 'D', text: 'Increase flow velocity' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '6',
        text: 'Elbows are mainly used to:',
        options: [
          { id: 'A', text: 'Increase pressure' },
          { id: 'B', text: 'Change flow direction' },
          { id: 'C', text: 'Reduce pipe diameter' },
          { id: 'D', text: 'Stop flow' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '7',
        text: 'What is the unit of pressure?',
        options: [
          { id: 'A', text: 'mm' },
          { id: 'B', text: 'kg' },
          { id: 'C', text: 'bar' },
          { id: 'D', text: 'm³' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '8',
        text: 'Expansion loop is provided to:',
        options: [
          { id: 'A', text: 'Increase flow' },
          { id: 'B', text: 'Reduce noise' },
          { id: 'C', text: 'Absorb thermal expansion' },
          { id: 'D', text: 'Reduce weight' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '9',
        text: 'A valve is used to:',
        options: [
          { id: 'A', text: 'Measure temperature' },
          { id: 'B', text: 'Control or stop flow' },
          { id: 'C', text: 'Increase stress' },
          { id: 'D', text: 'Support pipe' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '10',
        text: 'Which material is commonly used for high temperature piping?',
        options: [
          { id: 'A', text: 'PVC' },
          { id: 'B', text: 'Carbon Steel' },
          { id: 'C', text: 'Rubber' },
          { id: 'D', text: 'Wood' }
        ],
        correctAnswer: 'B'
      }
    ]
  },
  {
    id: 'MCQ2',
    title: 'Piping Stress Analysis (CAEPIPE Oriented)',
    questions: [
      {
        id: '1',
        text: 'In CAEPIPE, the first step is:',
        options: [
          { id: 'A', text: 'Run analysis' },
          { id: 'B', text: 'Define supports' },
          { id: 'C', text: 'Define material and code' },
          { id: 'D', text: 'Print report' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '2',
        text: 'Sustained load includes:',
        options: [
          { id: 'A', text: 'Wind load' },
          { id: 'B', text: 'Pressure and weight' },
          { id: 'C', text: 'Earthquake' },
          { id: 'D', text: 'Thermal load' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '3',
        text: 'Thermal expansion causes:',
        options: [
          { id: 'A', text: 'Compression only' },
          { id: 'B', text: 'No movement' },
          { id: 'C', text: 'Pipe displacement' },
          { id: 'D', text: 'Pressure drop' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '4',
        text: 'What is displacement in piping?',
        options: [
          { id: 'A', text: 'Change in pressure' },
          { id: 'B', text: 'Change in position of pipe' },
          { id: 'C', text: 'Pipe thickness' },
          { id: 'D', text: 'Flow rate' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '5',
        text: 'Which stress is checked against allowable stress?',
        options: [
          { id: 'A', text: 'Bending stress' },
          { id: 'B', text: 'Axial stress' },
          { id: 'C', text: 'Code stress' },
          { id: 'D', text: 'Shear stress' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '6',
        text: 'Anchor support restricts:',
        options: [
          { id: 'A', text: 'Temperature' },
          { id: 'B', text: 'All movements' },
          { id: 'C', text: 'Pressure' },
          { id: 'D', text: 'Flow' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '7',
        text: 'Guide support allows:',
        options: [
          { id: 'A', text: 'No movement' },
          { id: 'B', text: 'Vertical movement only' },
          { id: 'C', text: 'Axial movement' },
          { id: 'D', text: 'Controlled axial movement' }
        ],
        correctAnswer: 'D'
      },
      {
        id: '8',
        text: 'Load case W+P+T represents:',
        options: [
          { id: 'A', text: 'Wind + Pressure + Temperature' },
          { id: 'B', text: 'Weight + Pressure + Temperature' },
          { id: 'C', text: 'Water + Pipe + Tank' },
          { id: 'D', text: 'Work + Pressure + Tension' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '9',
        text: 'High stress at elbow is due to:',
        options: [
          { id: 'A', text: 'Straight pipe' },
          { id: 'B', text: 'Flow reduction' },
          { id: 'C', text: 'Bending effect' },
          { id: 'D', text: 'Low pressure' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '10',
        text: 'Stress optimization mainly involves:',
        options: [
          { id: 'A', text: 'Increasing pipe size' },
          { id: 'B', text: 'Removing supports' },
          { id: 'C', text: 'Adjusting supports and layout' },
          { id: 'D', text: 'Reducing pressure' }
        ],
        correctAnswer: 'C'
      }
    ]
  },
  {
    id: 'MCQ3',
    title: 'Advanced & Practical Piping Design',
    questions: [
      {
        id: '1',
        text: 'Pipe thickness is calculated based on:',
        options: [
          { id: 'A', text: 'Flow rate' },
          { id: 'B', text: 'Pressure and allowable stress' },
          { id: 'C', text: 'Color' },
          { id: 'D', text: 'Length' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '2',
        text: 'Hydrotest pressure is generally:',
        options: [
          { id: 'A', text: 'Lower than design pressure' },
          { id: 'B', text: 'Equal to design pressure' },
          { id: 'C', text: 'Higher than design pressure' },
          { id: 'D', text: 'Zero' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '3',
        text: 'What is a stress intensification factor (SIF)?',
        options: [
          { id: 'A', text: 'Flow multiplier' },
          { id: 'B', text: 'Factor increasing stress at fittings' },
          { id: 'C', text: 'Temperature factor' },
          { id: 'D', text: 'Pressure factor' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '4',
        text: 'Flexible piping layout reduces:',
        options: [
          { id: 'A', text: 'Cost only' },
          { id: 'B', text: 'Flow' },
          { id: 'C', text: 'Thermal stress' },
          { id: 'D', text: 'Pipe diameter' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '5',
        text: 'What is cold spring used for?',
        options: [
          { id: 'A', text: 'Reduce pressure' },
          { id: 'B', text: 'Pre-load to reduce operating stress' },
          { id: 'C', text: 'Stop leakage' },
          { id: 'D', text: 'Increase weight' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '6',
        text: 'Spring support is used when:',
        options: [
          { id: 'A', text: 'No movement' },
          { id: 'B', text: 'Large vertical displacement' },
          { id: 'C', text: 'Low temperature' },
          { id: 'D', text: 'Small pipes only' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '7',
        text: 'ASME B31.1 is used for:',
        options: [
          { id: 'A', text: 'Process piping' },
          { id: 'B', text: 'Power piping' },
          { id: 'C', text: 'Building plumbing' },
          { id: 'D', text: 'Water tanks' }
        ],
        correctAnswer: 'B'
      },
      {
        id: '8',
        text: 'Nozzle load check is required to protect:',
        options: [
          { id: 'A', text: 'Pipe' },
          { id: 'B', text: 'Valve' },
          { id: 'C', text: 'Equipment connection' },
          { id: 'D', text: 'Support' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '9',
        text: 'Corrosion allowance is added to:',
        options: [
          { id: 'A', text: 'Increase pressure' },
          { id: 'B', text: 'Increase pipe diameter' },
          { id: 'C', text: 'Increase life of pipe' },
          { id: 'D', text: 'Reduce stress' }
        ],
        correctAnswer: 'C'
      },
      {
        id: '10',
        text: 'The main objective of stress analysis is:',
        options: [
          { id: 'A', text: 'Reduce material' },
          { id: 'B', text: 'Ensure safe operation' },
          { id: 'C', text: 'Increase flow' },
          { id: 'D', text: 'Increase temperature' }
        ],
        correctAnswer: 'B'
      }
    ]
  }
];
