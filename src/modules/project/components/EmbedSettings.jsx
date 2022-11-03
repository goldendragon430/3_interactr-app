import React, {useState} from 'react';
import {Option, BooleanInput, SizeInput,   RangeInput, TextInput} from 'components/PropertyEditor';
import DropImageZone from 'modules/media/components/DropImageZone';
import ColorPicker from 'components/ColorPicker';
import Button from 'components/Buttons/Button';
import ProjectChaptersModal from "./ProjectChaptersModal";

const EmbedSettings = ({updateProject, project}) => {
  const [showChaptersPopup, setShowChaptersPopup] = useState(false);





  const isProjectLegacy = project.legacy;
  const {player_skin} = project;

  return (
    <div className="form-control" >
        <div className="grid">
          <div className="col6">
            <div className="form-control">

            </div>
          </div>
          <div className="col6">
            {!isProjectLegacy && (
              <div className="form-control">

              </div>
            )}
          </div>
          <div className="col6">
              <div className="form-control">

              </div>
          </div>
          <div className="col6">
            <div className="form-control">

            </div>
          </div>

          <div className="col12">
              <div className="form-control">

              </div>
          </div>
          <div className="col10">
              <div className="form-control">
                <label>Branding Image</label>
                <DropImageZone
                    onSuccess={({src}) => updateProject('branding_image_src', src)}
                    src={project.branding_image_src}
                    directory="brandingImages"
                />
                {!!project.branding_image_src && <Button onClick={() => updateProject('branding_image_src', null)} style={{marginTop: '10px'}}>Clear Image</Button>}
              </div>
          </div>
        </div>
    </div>
  );
};


export default EmbedSettings;