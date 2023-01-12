import {
  ESLintUtils,
  TSESLint,
  TSESTree,
} from '@typescript-eslint/experimental-utils';
import type { TmplAstBoundAttribute, TmplAstElement, TmplAstTextAttribute } from '@angular/compiler';
import type { ParseSourceSpan } from '@angular/compiler/src/compiler_facade_interface';

/**
 * We need to patch the RuleCreator in order to preserve the defaultOptions
 * to use as part of documentation generation.
 */
const patchedRuleCreator: typeof ESLintUtils.RuleCreator = (urlCreator) => function createRule({ name, meta, defaultOptions, create }) {
    return {
      meta: Object.assign(Object.assign({}, meta), {
        docs: Object.assign(Object.assign({}, meta.docs), {
          url: urlCreator(name),
        }),
      }),
      defaultOptions,
      create(context) {
        const optionsWithDefault = ESLintUtils.applyDefault(
          defaultOptions,
          context.options,
        );
        return create(context, optionsWithDefault);
      },
    };
  };

export const createESLintRule = patchedRuleCreator(
  (ruleName) => `${ruleName}`,
);

interface ParserServices {
  convertNodeSourceSpanToLoc: (
    sourceSpan: ParseSourceSpan,
  ) => TSESTree.SourceLocation;
  convertElementSourceSpanToLoc: (
    context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
    node: TmplAstElement,
  ) => TSESTree.SourceLocation;
}

export function getTemplateParserServices(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
): ParserServices {
  ensureTemplateParser(context);
  return context.parserServices as unknown as ParserServices;
}

/**
 * Utility for rule authors to ensure that their rule is correctly being used with @angular-eslint/template-parser
 * If @angular-eslint/template-parser is not the configured parser when the function is invoked it will throw
 */
export function ensureTemplateParser(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
): void {
  if (
    !(context.parserServices as unknown as ParserServices)
      ?.convertNodeSourceSpanToLoc ||
    !(context.parserServices as unknown as ParserServices)
      ?.convertElementSourceSpanToLoc
  ) {
    /**
     * The user needs to have configured "parser" in their eslint config and set it
     * to @angular-eslint/template-parser
     */
    throw new Error(
      'You have used a rule which requires \'@angular-eslint/template-parser\' to be used as the \'parser\' in your ESLint config.',
    );
  }
}

type Options = [];
export type MessageIds = 'dataTestIdButton' | 'dataTestIdInput';
export const RULE_NAME = 'data-test-id';

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Ensures that the `data-test-id` attribute is used on the `<button>` element',
      recommended: false,
    },
    schema: [],
    messages: {
      dataTestIdButton:
        'Button should have data-test-id attribute',
      dataTestIdInput:
        'Input should have data-test-id attribute',
    },
  },
  defaultOptions: [],
  create(context) {
    const parserServices = getTemplateParserServices(context);
    return {
      [`Element$1[name=button]:not(:has(:matches(BoundAttribute, TextAttribute)[name='data-test-id']))`]({
        sourceSpan,
      }: TmplAstBoundAttribute | TmplAstTextAttribute) {
        const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);

        context.report({
          loc,
          messageId: 'dataTestIdButton',
        });
      },
      [`Element$1[name=/^(button|select)$/]:not(:has(:matches(BoundAttribute, TextAttribute)[name='data-test-id']))`]({
        sourceSpan,
      }: TmplAstBoundAttribute | TmplAstTextAttribute) {
        const loc = parserServices.convertNodeSourceSpanToLoc(sourceSpan);

        context.report({
          loc,
          messageId: 'dataTestIdInput',
        });
      },
    };
  },
});
