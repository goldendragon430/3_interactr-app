export class Whitelabel{
  primaryClasses = [
    'modal-heading'
  ];

  secondaryClasses = [

  ];

  constructor(data){
    this.whitelabel = data;
    this.id = '_wl-styles';
    this.styleNode = document.getElementById(this.id);
    this.primary = this.whitelabel.primary_color;
    this.secondary = this.whitelabel.secondary_color;

    if (! this.styleNode) {
      this.styleNode = this.createNewStyleNode();
    }

    this.appendCssToDom();
  }

  createNewStyleNode(){
    let styleNode = document.createElement('style');
    styleNode.setAttribute('id', this.id);
    document.head.appendChild(styleNode);
    return styleNode;
  }

  appendCssToDom(){
    const rules = this.getRulesToAppend();

    rules.forEach((rule)=>{
      this.appendRuleToNode(rule);
    })
  }

  appendRuleToNode(rule){
    const css_rules_num = this.styleNode.sheet.cssRules.length;
    this.styleNode.sheet.insertRule(rule, css_rules_num);
  }

  getRulesToAppend() {
    return this.primaryColorRules.concat(this.secondaryColorRules, this.customRules);
  }

  get primaryColorRules() {
    let $rules = [];
    this.primaryClasses.forEach((colorClass)=>{
      $rules.push([
        this.generateCssString(colorClass, 'background-color', this.primary)
      ])
    });
    return $rules;
  }

  get secondaryColorRules(){
    let $rules = [];
    return $rules;
  }

  get customRules(){
    let $rules = [];
    return $rules;
  }

  generateCssString(className, style, value){
    return '.'+className+' {'+ style +': ' + value + ' !important}'
  }
};
