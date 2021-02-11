interface BooleanReplacement {
  true: string;
  false: string;
}

interface ConditionalAction {
  isStandard: boolean;
  tooltip: BooleanReplacement;
  icon: BooleanReplacement;
  color: BooleanReplacement;
}

interface StandardAction {
  conditionBaseKey: string;
  tooltip: string;
  icon: string;
  color: string;
}

interface IsAction {
  isAction: boolean;
  actions: (StandardAction | ConditionalAction)[];
}

interface IsBoolean {
  isBoolean: boolean;
  display: BooleanReplacement;
}

export interface Column<GenericModel> {
  name: keyof GenericModel;
  sortable?: boolean;
  config?: IsAction | IsBoolean;
}
