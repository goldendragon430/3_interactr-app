import React from 'react';
import { Section, Option, MultiSelect, RangeInput, SelectInput } from 'components/PropertyEditor';
import {easings} from '../../../../utils/animations';
import Button from 'components/Buttons/Button';
import map from "lodash/map";
import LinkButton from "../../../../components/Buttons/LinkButton";
import Icon from 'components/Icon';
import {useAuthUser} from "../../../../graphql/User/hooks";
import ErrorMessage from "../../../../components/ErrorMessage";
import {motion} from "framer-motion";
import {useParams} from 'react-router-dom'
import {useReactiveVar} from "@apollo/client";
import {getAcl} from "../../../../graphql/LocalState/acl";
import Link from "../../../../components/Link";
import { getEditPopup } from '@/graphql/LocalState/editPopup';


const AnimationElementProperties = ({ element, update, tabAnimation }) => {
  let { modalId, nodeId } = useParams();
  const { modal } = useReactiveVar(getEditPopup);
  const acl = useReactiveVar(getAcl)

  if(!modalId && modal) {
		modalId = modal.id;
	}

  if(! element) return null;

  function getAnimationProperty(property) {
    return element && element.animation ? element.animation[property] : '';
  }
  const changeHandler = property => (val) => {
    if (element) {
      const animation = (element.animation) ? Object.assign({}, element.animation) : {};
      animation[property] = val.value ? val.value : val; // handle selects
      update({ animation });
    }
  };
  return (
    <motion.div {...tabAnimation}>
    <Section >
        {
            (!! acl.canAccessCustomAnimations) &&
                <div>
                    <Option
                        label="Animation Type"
                        name="background-animation-select"
                        value={getAnimationProperty('name')}
                        options={map(element_animations, (b,i)=>( {label: b.label, value:i} ) )}
                        Component={SelectInput}
                        onChange={changeHandler('name')}
                    />
                    <Option
                        label="Animation Easing"
                        name="background-easing-select"
                        value={getAnimationProperty('easing')}
                        options={easings}
                        Component={SelectInput}
                        onChange={changeHandler('easing')}
                    />
                </div>
        }
        {
            (! acl.isSubUser && ! acl.canAccessCustomAnimations) &&
            <div className="form-control">
                <label>Animation Type</label>
                <p style={{margin: 5}}>
                    <small>
                      You must upgrade your account to select a custom animation <Link to={'/upgrade'} small primary>click here to upgrade</Link>
                    </small>
                </p>
            </div>
        }

      <Option
        label="Animation Duration"
        value={getAnimationProperty('duration')}
        max={3}
        min={0.1}
        step={0.1}
        Component={RangeInput}
        onChange={changeHandler('duration')}
      />
      <Option
        label="Animation Delay"
        value={getAnimationProperty('delay')}
        max={10}
        min={0.1}
        step={0.1}
        Component={RangeInput}
        onChange={changeHandler('delay')}
      />
      {/* Check we have the needed props before we can preview an animation */}
      { !! getAnimationProperty('name') &&
        !! getAnimationProperty('easing') &&
        !! getAnimationProperty('duration') &&
        <div className="form-control">
          <Button
            secondary
            icon="play"
            small
            onClick={() => {
              const eventName = (modalId) ? 'Modal:'+ modalId : "Node:"+nodeId;
              var event = new CustomEvent('preview_animation', {'detail': eventName });
              window.dispatchEvent(event);
            }}
          >
            Preview Animations
          </Button>
        </div>
      }
    </Section>
    </motion.div>
  );
}
export default AnimationElementProperties;