import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';
import networkExample from '../aptitudes/network/networkExample';

export default class VetStatusWhisper {
  constructor() {
    this.whisper = undefined;
    this.label = 'Veteran Status Tracker';
    this.props = {
      vetStatus: '',
      firstName: '',
      middleName: '',
      lastName: '',
      ssn: '',
      genderSelected: 0,
      dateOfBirth: '',
    };
  }

  createComponents() {
    const divider = {
      type: whisper.WhisperComponentType.Divider,
    };

    
    const successMessage = {
      type: whisper.WhisperComponentType.Message,
      body: this.props.vetStatus || '',
      style: whisper.Urgency.Success,
    };

    

    // Box example.
    const boxHeader = {
      type: whisper.WhisperComponentType.Markdown,
      body: '# Patient Info',
    };
    
    const firstNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'First Name',
      value: this.props.firstName || '',
      onChange: (_error, val) => {
        console.log('Text changed: ', val);
        this.update({firstName: val});
      },
    };
    const middleNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Middle Name',
      value: this.props.middleName || '',
      onChange: (_error, val) => {
        console.log('Text changed: ', val);
        this.update({middleName: val});
      },
    };
    const lastNameInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'Last Name',
      value: this.props.lastName || '',
      onChange: (_error, val) => {
        console.log('Text changed: ', val);
        this.update({lastName: val});
      },
    };
    
    const ssnInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: 'SSN',
      value: this.props.ssn || '',
      onChange: (_error, val) => {
        console.log('Text changed: ', val);
        this.update({ssn: val});
      },
    };
    const genderInputSelect = {
      type: whisper.WhisperComponentType.Select,
      label: 'Select Box',
      options: ['F', 'M'],
      selected: 0,
      onSelect: (_error, val) => {
        console.log('Selected: ', val);
        this.update({genderSelected: val});
      },
    };
    const birthDateInputSelect = {
      type: whisper.WhisperComponentType.DateTimeInput,
      dateTimeType: 'date',
      label: 'DOB',

      onChange: (_error, val) => {
        console.log('Text changed: ', val);
        this.update({dateOfBirth: val});
      },
    };

    const button = {
      type: whisper.WhisperComponentType.Button,
      label: 'Check Status Now',
      onClick: () => {
        console.log('Button clicked.');
        console.log(this.props.dateOfBirth);

        let firstName = this.props.firstName;
        let middleName = this.props.middleName;
        let lastName = this.props.lastName;
        
        let gender = genderInputSelect.options[this.props.genderSelected];

        if (this.props.dateOfBirth === '') {
          this.update({vetStatus: `Please Enter a date of birth`});
        } else {
          networkExample.run(firstName, middleName, lastName, this.props.ssn , gender, this.props.dateOfBirth).then(result => {
            console.log('about to update: ' + result);
            
            if(result === 'confirmed') {
              this.update({vetStatus: `${firstName} ${middleName} ${lastName} is a veteran.`});
            } else {
              this.update({vetStatus: `${firstName} ${middleName} ${lastName} is not a veteran.`});
            }
                       
        }).catch(err => {
          console.log('Could not retrieve value form API: ' + result);
        });
        }
        
      },
    };

    return [
      
      successMessage,
      boxHeader,
      firstNameInput,
      middleNameInput,
      lastNameInput,
      ssnInput,
      genderInputSelect,
      birthDateInputSelect,   
      button,
    ];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: VetStatusWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  update(props) {
    this.props = { ...this.props, ...props };
    this.whisper.update({
      label: this.props.label || this.label,
      components: this.createComponents(),
    });
  }

  close() {
    this.whisper.close(VetStatusWhisper.onClose);
  }

  static onClose(err) {
    if (err) {
      console.error('There was an error closing Vet Status whisper', err);
    }
    console.log('Vet Status whisper closed');
  }
  
}
