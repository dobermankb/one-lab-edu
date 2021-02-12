interface BooleanReplacement {
  onTrue: string;
  onFalse: string;
}

interface ConditionalAction {
  name: string;
  conditionBaseKey: string;
  tooltip: BooleanReplacement;
  icon: BooleanReplacement;
  color: BooleanReplacement;
}

interface IsAction {
  actions: ConditionalAction[];
}

interface IsBoolean {
  display: BooleanReplacement;
}

export interface Column<GenericModel> {
  name: string;
  displayName: string;
  sortable?: boolean;
  configAction?: IsAction;
  configBoolean?: IsBoolean;
}
