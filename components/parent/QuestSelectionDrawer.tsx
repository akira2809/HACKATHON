'use client';

import { Icon } from '@iconify/react';
import {
    Accordion,
    AccordionItem,
    Chip,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
} from '@heroui/react';
import type { ParentQuest } from '@/state/appState';
import {
    HearthActionButton,
    HearthCategoryChip,
    HearthRewardChip,
    getHearthCategoryMeta,
} from '@/components/design-system/HearthPrimitives';

type QuestSelectionDrawerProps = {
    childName: string;
    errorMessage: string | null;
    feedbackMessage: string | null;
    isConfirming: boolean;
    isLoading: boolean;
    isRefreshingOptions: boolean;
    isOpen: boolean;
    onBackToSelection: () => void;
    onConfirm: () => void;
    onDone: () => void;
    onOpenChange: (isOpen: boolean) => void;
    onRegenerateOptions: () => void;
    onRetry: () => void;
    onToggleQuest: (questId: string) => void;
    options: ParentQuest[];
    phase: 'select' | 'confirm';
    selectedQuestIds: string[];
};

function getGuideSteps(quest: ParentQuest) {
    return quest.guidingQuestions?.filter((step) => step?.prompt?.trim()) ?? [];
}

function QuestOptionSkeleton() {
    return (
        <div className="rounded-[24px] border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.96)] p-4 shadow-[0_10px_22px_rgba(79,107,82,0.05)]">
            <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="hearth-loading-shimmer h-8 w-28 rounded-full" />
                        <div className="hearth-loading-shimmer h-8 w-32 rounded-full" />
                    </div>
                    <div className="hearth-loading-shimmer h-8 w-24 rounded-full" />
                </div>
                <div className="hearth-loading-shimmer h-6 w-52 rounded-full" />
                <div className="grid gap-2">
                    <div className="hearth-loading-shimmer h-5 rounded-full" />
                    <div className="hearth-loading-shimmer h-5 w-[84%] rounded-full" />
                </div>
            </div>
        </div>
    );
}

function QuestGuidingSteps({
    quest,
}: {
    quest: ParentQuest;
}) {
    const guideSteps = getGuideSteps(quest);

    if (!guideSteps.length) {
        return null;
    }

    return (
        <div className="rounded-[18px] border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.88)] px-3">
            <Accordion
                selectionMode="multiple"
                showDivider={false}
                variant="light"
            >
                <AccordionItem
                    aria-label="Guiding Steps"
                    key={`${quest.id}-guiding-steps`}
                    textValue="Guiding Steps"
                    title={(
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--hearth-text-muted)]">
                            Guiding Steps
                        </span>
                    )}
                >
                    <ol className="grid gap-1.5 pb-1">
                        {guideSteps.map((guideStep, index) => (
                            <li
                                className="text-[11px] leading-5 text-[var(--hearth-text-secondary)] sm:text-[12px]"
                                key={`${quest.id}-guide-step-${index}`}
                            >
                                <span className="mr-1 font-semibold text-[var(--hearth-text-primary)]">
                                    {guideStep.step ?? index + 1}.
                                </span>
                                {guideStep.prompt}
                            </li>
                        ))}
                    </ol>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function QuestOptionCard({
    quest,
    isSelected,
    onToggle,
}: {
    quest: ParentQuest;
    isSelected: boolean;
    onToggle?: ((questId: string) => void) | undefined;
}) {
    const categoryMeta = getHearthCategoryMeta(quest.category);
    const isSelectable = typeof onToggle === 'function';

    return (
        <div
            className={`rounded-[24px] border p-4 transition-colors duration-200 ${
                isSelected
                    ? 'border-[rgba(79,107,82,0.22)] bg-[rgba(216,227,209,0.24)] shadow-[0_12px_24px_rgba(79,107,82,0.06)]'
                    : 'border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.96)]'
            }`}
        >
            <div className="grid gap-3">
                <button
                    className="grid w-full gap-3 text-left"
                    onClick={isSelectable ? () => onToggle(quest.id) : undefined}
                    type={isSelectable ? 'button' : undefined}
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="grid min-w-0 flex-1 gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <HearthCategoryChip category={quest.category} />
                                <Chip
                                    radius="full"
                                    variant="flat"
                                    className={isSelected
                                        ? 'border border-[rgba(230,199,102,0.28)] bg-[rgba(230,199,102,0.18)] text-[var(--hearth-text-primary)]'
                                        : 'border border-[rgba(79,107,82,0.1)] bg-[rgba(251,248,241,0.68)] text-[var(--hearth-text-muted)]'}
                                >
                                    <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                        {isSelected ? 'Selected' : 'Tap To Choose'}
                                    </span>
                                </Chip>
                            </div>
                            <h3 className="text-[0.98rem] font-semibold leading-6 text-[var(--hearth-text-primary)] sm:text-base">
                                {quest.title}
                            </h3>
                        </div>
                        <HearthRewardChip
                            className="shrink-0 whitespace-nowrap"
                            startContent={<Icon icon={categoryMeta.icon} className={`size-3.5 ${categoryMeta.iconClassName}`} />}
                        >
                            {quest.reward} Seeds
                        </HearthRewardChip>
                    </div>
                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                        {quest.description}
                    </p>
                </button>

                <QuestGuidingSteps quest={quest} />
            </div>
        </div>
    );
}

export function QuestSelectionDrawer({
    childName,
    errorMessage,
    feedbackMessage,
    isConfirming,
    isLoading,
    isRefreshingOptions,
    isOpen,
    onBackToSelection,
    onConfirm,
    onDone,
    onOpenChange,
    onRegenerateOptions,
    onRetry,
    onToggleQuest,
    options,
    phase,
    selectedQuestIds,
}: QuestSelectionDrawerProps) {
    const suggestedOptions = options.filter((quest) => quest.status === 'suggested');
    const visibleSelectedQuestIds = selectedQuestIds.filter((questId) =>
        suggestedOptions.some((quest) => quest.id === questId),
    );
    const selectedCount = visibleSelectedQuestIds.length;
    const selectedQuests = suggestedOptions.filter((quest) => visibleSelectedQuestIds.includes(quest.id));
    const unselectedQuests = suggestedOptions.filter((quest) => !visibleSelectedQuestIds.includes(quest.id));
    const shouldShowRegenerate = phase === 'select' && selectedCount > 0 && selectedCount < 3 && !isLoading && !isRefreshingOptions;
    const refreshSkeletonCount = Math.max(1, 5 - selectedCount);

    return (
        <Drawer
            backdrop="blur"
            hideCloseButton={true}
            shouldBlockScroll={true}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            isOpen={isOpen}
            placement="bottom"
            onOpenChange={onOpenChange}
        >
            <DrawerContent className="mx-auto flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[32px] border border-[rgba(79,107,82,0.12)] bg-[var(--hearth-bg-surface)] shadow-[0_-12px_36px_rgba(47,52,44,0.14)]">
                {(onClose) => (
                    <>
                        <DrawerHeader className="shrink-0 grid gap-3 border-b border-[rgba(79,107,82,0.08)] px-3 pb-3 pt-4 sm:px-5">
                            <div className="mx-auto h-1.5 w-12 rounded-full bg-[rgba(79,107,82,0.12)]" />
                            <div className="grid gap-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="hearth-kicker">
                                        {phase === 'select' ? 'Choose 3 Quests' : 'Confirm Selection'}
                                    </p>
                                    <Chip
                                        radius="full"
                                        variant="flat"
                                        className="border border-[rgba(79,107,82,0.12)] bg-[rgba(216,227,209,0.22)] text-[var(--hearth-text-secondary)]"
                                    >
                                        <span className="px-1 text-[10px] font-semibold sm:text-[11px]">
                                            {selectedCount} of 3 selected
                                        </span>
                                    </Chip>
                                </div>
                                <h2 className="hearth-heading text-[1.35rem] font-semibold tracking-[-0.03em] text-[var(--hearth-text-primary)] sm:text-[1.5rem]">
                                    {phase === 'select' ? `Fresh quest options for ${childName}` : `Confirm ${childName}'s next 3 quests`}
                                </h2>
                                <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                    {phase === 'select'
                                        ? "Pick exactly three calm quest options. These will become today's ready quests for the child to begin."
                                        : 'Review the three chosen quests, then confirm to save them for today.'}
                                </p>
                                {isLoading || isRefreshingOptions ? (
                                    <div className="flex items-center gap-2 text-[13px] text-[var(--hearth-text-secondary)] sm:text-sm">
                                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-[rgba(230,199,102,0.18)] text-[var(--hearth-accent-wood)]">
                                            <Icon icon="lucide:refresh-cw" className="size-4 animate-spin [animation-duration:1.8s]" />
                                        </span>
                                        {isRefreshingOptions
                                            ? `Keeping ${selectedCount} selected ${selectedCount === 1 ? 'quest' : 'quests'} while the remaining options refresh...`
                                            : "Preparing today's quest options..."}
                                    </div>
                                ) : null}
                            </div>
                        </DrawerHeader>

                        <DrawerBody className="hearth-scrollbar-hidden min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-5">
                            {isLoading ? (
                                <>
                                    <div className="rounded-[24px] border border-[rgba(230,199,102,0.2)] bg-[rgba(230,199,102,0.08)] p-4">
                                        <div className="grid gap-2">
                                            <p className="hearth-kicker">Preparing Options</p>
                                            <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                                We are preparing five calm quest options for {childName}.
                                            </p>
                                        </div>
                                    </div>
                                    <QuestOptionSkeleton />
                                    <QuestOptionSkeleton />
                                    <QuestOptionSkeleton />
                                    <QuestOptionSkeleton />
                                    <QuestOptionSkeleton />
                                </>
                            ) : errorMessage && !suggestedOptions.length ? (
                                <div className="grid gap-3 rounded-[24px] border border-[rgba(180,106,90,0.14)] bg-[rgba(251,248,241,0.94)] p-4">
                                    <p className="hearth-kicker">Generation Paused</p>
                                    <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                        {errorMessage}
                                    </p>
                                </div>
                            ) : phase === 'confirm' ? (
                                <>
                                    {selectedQuests.map((quest) => (
                                        <QuestOptionCard
                                            isSelected={true}
                                            key={quest.id}
                                            quest={quest}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {selectedQuests.map((quest) => (
                                        <QuestOptionCard
                                            isSelected={true}
                                            key={quest.id}
                                            onToggle={onToggleQuest}
                                            quest={quest}
                                        />
                                    ))}

                                    {isRefreshingOptions
                                        ? Array.from({ length: refreshSkeletonCount }, (_, index) => (
                                            <QuestOptionSkeleton key={`refresh-skeleton-${index}`} />
                                        ))
                                        : unselectedQuests.map((quest) => (
                                            <QuestOptionCard
                                                isSelected={false}
                                                key={quest.id}
                                                onToggle={onToggleQuest}
                                                quest={quest}
                                            />
                                        ))}

                                    {!isRefreshingOptions && !selectedQuests.length && !unselectedQuests.length ? (
                                        <div className="grid gap-3 rounded-[24px] border border-[rgba(79,107,82,0.12)] bg-[rgba(251,248,241,0.94)] p-4">
                                            <p className="hearth-kicker">No Suggested Quests</p>
                                            <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                                Lena did not return any suggested quest cards just yet. Try again for another set.
                                            </p>
                                        </div>
                                    ) : null}
                                </>
                            )}

                            {feedbackMessage ? (
                                <p className="text-[13px] leading-6 text-[var(--hearth-accent-wood)] sm:text-sm">
                                    {feedbackMessage}
                                </p>
                            ) : null}
                        </DrawerBody>

                        <DrawerFooter className="shrink-0 border-t border-[rgba(79,107,82,0.08)] bg-[rgba(251,248,241,0.94)] px-3 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
                            {errorMessage ? (
                                <div className="grid w-full gap-3">
                                    <div className="grid gap-1.5">
                                        <p className="hearth-kicker">Need Another Try</p>
                                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                            The quest options did not come through this time.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2.5">
                                        <HearthActionButton tone="secondary" onPress={onClose}>
                                            Close
                                        </HearthActionButton>
                                        <HearthActionButton onPress={onRetry}>
                                            Try Again
                                        </HearthActionButton>
                                    </div>
                                </div>
                            ) : phase === 'confirm' ? (
                                <div className="grid w-full gap-3">
                                    <div className="grid gap-1.5">
                                        <p className="hearth-kicker">Confirm</p>
                                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                            The selected 3 quests will be saved as ready quests for the child to begin.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-2.5">
                                        <HearthActionButton tone="secondary" onPress={onBackToSelection}>
                                            Edit
                                        </HearthActionButton>
                                        <HearthActionButton isLoading={isConfirming} onPress={onConfirm}>
                                            Confirm
                                        </HearthActionButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid w-full gap-3">
                                    <div className="grid gap-1.5">
                                        <p className="hearth-kicker">Selection</p>
                                        <p className="text-[13px] leading-6 text-[var(--hearth-text-secondary)] sm:text-sm">
                                            {shouldShowRegenerate
                                                ? 'Keep your selected quests and ask Lena for different ideas in the remaining slots.'
                                                : 'Choose exactly 3 quest options before saving them for today.'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-end gap-2.5">
                                        {shouldShowRegenerate ? (
                                            <HearthActionButton
                                                tone="ghost"
                                                onPress={onRegenerateOptions}
                                            >
                                                Regenerate Others
                                            </HearthActionButton>
                                        ) : null}
                                        <HearthActionButton tone="secondary" onPress={onClose}>
                                            Close
                                        </HearthActionButton>
                                        <HearthActionButton
                                            isDisabled={selectedCount !== 3 || !suggestedOptions.length}
                                            onPress={onDone}
                                        >
                                            Done
                                        </HearthActionButton>
                                    </div>
                                </div>
                            )}
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
