import React from 'react';
import Label from 'components/Label';

export default function PrivacyLabel({ project }) {
  return project.is_public ? <Label primary>Public</Label> : <Label danger>Private</Label>;
}
